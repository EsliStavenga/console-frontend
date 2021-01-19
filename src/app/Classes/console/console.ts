import {StringService} from '../../Services/string.service';
import {InvalidArgumentException} from '../../Exceptions/invalid-argument-exception';
import {ExecuteCommandQuery} from '../../Queries/ExecuteCommandQuery';
import {Response} from '../../Entities/Response';
import {AppInjectorService} from '../../Services/app-injector.service';
import Timeout = NodeJS.Timeout;
import {Keys} from './Keys';
import {Command} from '../../Entities/Command';
import {ICommand} from '../../Entities/ICommand';
import * as commands from '../../Entities/Commands';
import {ChangeDirectoryCommand} from '../../Entities/Commands/ChangeDirectoryCommand';

class FailedCommand extends Command implements ICommand{
	command: string = '';
	help: string = '';

	execute(): Command {
		return undefined;
	}
}

export class Console {

	public executedCommands: ICommand[] = [];
	public loadingText: string = '';
	public showErrorIcon: boolean = false;
	public path: string = '~';
	public user: string = 'root';

	private loadingTextTimer: Timeout = null;
	private executeCommandQuery: ExecuteCommandQuery

	private readonly WHITESPACE = '\u00A0';
	private readonly characterWhitelist: string[];
	private _preCursor = ''; //before the white flashy bit
	private _cursor = this.WHITESPACE; //The text underneath the user's cursor
	private _postCursor = ''; //after the white flashy bit
	private keysPressed = Keys.NONE;
	private history: string[] = [];
	private currentHistoryItem = 0;
	private readonly availableCommands: ICommand[] = [];

	constructor(
		allowedCharacters: string[] = []
	) {
		this.availableCommands = this.getAvailableCommands();
		this.characterWhitelist = allowedCharacters;
		this.executeCommandQuery = AppInjectorService.AppInjector.get(ExecuteCommandQuery);
		this.clear();
	}

	/* Getters and setters have to agree on visibility so this is to work around that problem */
	public get preCursor(): string {
		return this._preCursor;
	}

	public get cursor(): string {
		return this._cursor;
	}

	public get postCursor(): string {
		return this._postCursor;
	}

	public home(): void {
		while (this.preCursor) {
			this.moveCursorLeft();
		}
	}

	public end(): void {
		//TODO test this
		while (this.postCursor) {
			this.moveCursorRight();
		}
	}

	public backspace(): void {
		this._preCursor = StringService.removeLastCharacterFromString(this._preCursor);
	}

	public delete(): void {
		if (this.moveCursorRight()) {
			this.movePreCursorLeft();
		}
	}

	/**
	 *
	 * @param s One or multiple characters to be added to the console input field
	 * @throws InvalidArgumentException When a character is not in the allowed characters list
	 */
	public addText(s: string): Console {
		s.split('').forEach((char) => {
			this.addCharacter(char);
		})

		return this;
	}

	public addCharacter(s: string): void {
		if(s.length != 1) {
			throw new InvalidArgumentException(`Expected exactly 1 character, ${s.length} specified`);
		}

		if (!this.characterWhitelist.includes(s.toLowerCase())) {
			throw new InvalidArgumentException(`Character '${s}' is not in allowed characters list`);
		}

		if(this.isKeyPressed(Keys.CONTROL)) {
			this.handleSpecialKeyPress(s);
			return;
		}

		this.addToPrecursor(s);
	}

	/**
	 *
	 * @returns boolean Returns whether or not the cursor was moved one position
	 */
	public moveCursorLeft(): boolean {
		const lastPreCursorChar = StringService.getLastCharacterFromString(this._preCursor);

		if (lastPreCursorChar) {
			this.movePreCursorLeft();
			this.movePostCursorLeft();
			this.changeCursorText(lastPreCursorChar);
		}

		//!! will return true if there is a character, false if the lastPreCursorChar is empty
		return !!(lastPreCursorChar);
	}

	/**
	 *
	 * @returns boolean Returns whether or not the cursor was moved one position
	 */
	public moveCursorRight(): boolean {
		//get the first character after the cursor OR whitespace if it's empty (e.g. cursor behind text)
		const firstPostCursorChar = StringService.getFirstCharacterFromStringOrDefault(this._postCursor, this.WHITESPACE);

		if (firstPostCursorChar) {
			this.movePreCursorRight();
			this.movePostCursorRight();
			this.changeCursorText(firstPostCursorChar);
		}

		return !!(firstPostCursorChar);
	}

	private changeCursorText(newCharacter: string): void {
		//this will ensure the cursor has some width, normal spaces are 0 width characters
		if (newCharacter === ' ') {
			newCharacter = this.WHITESPACE;
		}

		this._cursor = newCharacter;
	}

	private movePreCursorLeft(): void {
		//remove one character from the preCursor text
		this._preCursor = StringService.removeLastCharacterFromString(this._preCursor);
	}

	private movePreCursorRight(): void {
		this._preCursor += this._cursor;
	}

	private movePostCursorLeft(): void {
		//set the postCursor text to the character BEFORE moving the cursor + it's current text
		this._postCursor = this._cursor + this._postCursor;
	}

	private movePostCursorRight(): void {
		this._postCursor = StringService.removeFirstCharacterFromString(this._postCursor);
	}

	/**
	 * Go back in time, or the executed commands
	 */
	public goBackInHistoryByOne(): boolean
	{
		if(this.currentHistoryItem === 0) {
			return false;
		}

		this.currentHistoryItem--;

		return this.loadHistory();
	}

	/**
	 * Gets you one item closer to the present
	 */
	public goForwardInHistoryByOne(): boolean
	{
		if(this.currentHistoryItem >= this.history.length) {
			return false;
		}

		this.currentHistoryItem++;
		if(this.currentHistoryItem === this.history.length) {
			this.clearCursor();
			return true;

		}
		return this.loadHistory();
	}

	private loadHistory(): boolean
	{
		if(!this.history[this.currentHistoryItem]) {
			return false;
		}

		this.clearCursor();
		this._preCursor = this.history[this.currentHistoryItem];
		return true;
	}


	public execute(): Promise<boolean> {

		return new Promise(resolve => {
			const fullCommand = this.getCommand();

			if(!fullCommand) {
				return;
			}

			this.history.push(fullCommand);

			this.clear();
			this.startLoadingText();


			const c = new FailedCommand();
			c.fullCommand = fullCommand;
			c.path = this.path;

			const command = fullCommand.split(' ')[0];
			console.log(command);

			const commandToExecute = this.availableCommands.filter(x => x.command === command);

			if(commandToExecute.length !== 1) {
				this.showErrorIcon = false;
				c.hasFailed = false;
				c.response = new Response({
					'title': command,
					'responseLines': [
						{

							'parts': [{
								'content': `Error: The command '${command}' was not found`,
								'foregroundColor': '8a2828'
							}]
						}
					]
				});
			}

			this.handleResponseData(c);

			// const c = new Command();
			// c.command = command;
			// c.path = this.path;
			//
			// this.executeCommandQuery.execute(command)
			// 	.then((response) => {
			// 		this.showErrorIcon = false;
			// 		c.hasFailed = false;
			// 		c.response = response;
			//
			// 		this.handleResponseData(c);
			// 	})
			// 	.catch((errorResponse) => {
			// 		this.showErrorIcon = true;
			// 		c.hasFailed = true;
			// 		c.response = errorResponse;
			//
			// 		this.handleResponseData(c);
			// 	})
			// 	.finally(() => {
			// 		resolve(this.showErrorIcon);
			// 	});
		})
	}

	public get isShiftPressed(): boolean {
		return this.isKeyPressed(Keys.SHIFT);
	}

	public get isControlPressed(): boolean {
		return this.isKeyPressed(Keys.CONTROL);
	}

	public set isControlPressed(value: boolean) {
		this.setKeyPressed(Keys.CONTROL, value);
	}

	public set isShiftPressed(value: boolean) {
		this.setKeyPressed(Keys.SHIFT, value);
	}

	public toggleShiftPressed(): boolean {
		return this.toggleKeyPress(Keys.SHIFT);
	}

	public get isCapsLockPressed(): boolean {
		return this.isKeyPressed(Keys.CAPS);
	}

	public toggleCapsLockPressed(): boolean {
		return this.toggleKeyPress(Keys.CAPS);
	}

	public clearAllKeysPressed() {
		this.keysPressed = Keys.NONE;
	}

	private shouldCapitalise(): boolean {
		return this.isCapsLockPressed != this.isShiftPressed && (this.isShiftPressed || this.isCapsLockPressed);
	}

	private clearCursor() {
		this._preCursor = '';
		this._cursor = this.WHITESPACE;
		this._postCursor = '';
	}

	private clear() {
		this.currentHistoryItem = this.history.length;
		this.clearCursor();
		this.clearLoadingText();
	}

	private clearLoadingText() {
		clearInterval(this.loadingTextTimer);
		this.loadingText = '';
	}

	private startLoadingText() {
		this.loadingTextTimer = setInterval(() => {
			if(this.loadingText.length === 10) {
				this.loadingText = '';
			}

			this.loadingText += '.';
		}, 1000);
	}

	private handleResponseData(command: ICommand) {
		this.executedCommands.push(command);
		this.clearLoadingText();
	}

	private isKeyPressed(key: Keys) {
		return (this.keysPressed & key) === key;
	}

	private toggleKeyPress(key: Keys): boolean {
		return this.setKeyPressed(key, (!this.isKeyPressed(key)));
	}

	private setKeyPressed(key: Keys, isPressed: boolean): boolean {
		if(isPressed) {
			this.addKeyPressed(key);
		} else {
			this.removeKeyPressed(key);
		}

		return this.isKeyPressed(key);
	}

	private addKeyPressed(key: Keys): void {
		this.keysPressed |= key;
	}

	private removeKeyPressed(key: Keys): void {
		this.keysPressed &= ~key;
	}

	private handleSpecialKeyPress(s: string): void {
		if (!this.isKeyPressed(Keys.CONTROL) || this.isShiftPressed) {
			return;
		}

		const shiftIsPressed = this.isKeyPressed(Keys.SHIFT);

		this.addKeyPressed(Keys.SHIFT);
		this.addToPrecursor(`^${s}`);
		this.removeKeyPressed(Keys.SHIFT);

		if(s.toLowerCase() === 'c') {
			this.cancelCurrentInput();
		}
	}

	private cancelCurrentInput(): void {
		// const response = new Response({
		// 	title: '',
		// 	responseLines: [{
		// 		parts: [{
		// 			foregroundColor: '7e1313',
		// 			content: `✘ root@eslistavenga:~# ${this.getCommand()}`
		// 		}]
		// 	}]
		// });

		const c = new FailedCommand();
		c.command = this.getCommand();
		c.path = this.path;

		this.executedCommands.push(c);
		this.clear();
	}

	private addToPrecursor(s: string): void {
		if(this.shouldCapitalise()) {
			s = s.toUpperCase();
		} else {
			s = s.toLowerCase();
		}

		this._preCursor += StringService.globalStringReplace(' ', this.WHITESPACE, s);
	}

	private getCommand(): string {
		return (this.preCursor + this.cursor + this.postCursor).trim();
	}

	private getAvailableCommands(): ICommand[] {
		return ICommand.GetImplementations().map(x => new x());

	}
}
