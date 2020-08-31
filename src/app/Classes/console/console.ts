import {StringService} from '../../Services/string.service';
import {InvalidArgumentException} from '../../Exceptions/invalid-argument-exception';
import {ExecuteCommandQuery} from '../../Queries/ExecuteCommandQuery';
import {Response} from '../../Entities/Response';
import {AppInjectorService} from '../../Services/app-injector.service';
import Timeout = NodeJS.Timeout;

export class Console {

	public responses: Response[] = [];
	public loadingText: string = '';
	public showErrorIcon: boolean = false;

	private loadingTextTimer: Timeout = null;
	private executeCommandQuery: ExecuteCommandQuery

	private readonly WHITESPACE = '\u00A0';
	private readonly characterWhitelist: string[];

	private _preCursor = ''; //before the white flashy bit
	private _cursor = this.WHITESPACE; //The text underneath the user's cursor
	private _postCursor = ''; //after the white flashy bit
	private history: string[] = [];
	private currentHistoryItem = 0;

	constructor(
		allowedCharacters: string[] = []
	) {
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

		if (!this.characterWhitelist.includes(s)) {
			throw new InvalidArgumentException(`Character '${s}' is not in allowed characters list`);
		}

		this._preCursor += StringService.globalStringReplace(' ', this.WHITESPACE, s);
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
			const command = (this.preCursor + this.cursor + this.postCursor).trim();

			if(!command) {
				return;
			}

			this.history.push(command);

			this.clear();
			this.startLoadingText();

			this.executeCommandQuery.execute(command)
				.then((response) => {
					this.showErrorIcon = false;
					this.handleResponseData(response);
				})
				.catch((errorResponse) => {
					this.showErrorIcon = true;
					this.handleResponseData(errorResponse);
				})
				.finally(() => {
					resolve(this.showErrorIcon);
				});
		})



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

	private handleResponseData(response: Response) {
		this.responses.push(response);
		this.clearLoadingText();
	}
}
