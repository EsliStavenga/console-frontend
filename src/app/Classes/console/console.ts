import {StringService} from "../../Services/string.service";
import {Observable, Subscriber} from "rxjs";
import {InvalidArgumentException} from "../../Exceptions/invalid-argument-exception";

export class Console {

	private readonly WHITESPACE = '\u00A0';
	private readonly characterWhitelist: string[];

	private _preCursor = ''; //before the white flashy bit
	private _cursor = this.WHITESPACE; //The text underneath the user's cursor
	private _postCursor = ''; //after the white flashy bit

	constructor(allowedCharacters: string[]) {
		this.characterWhitelist = allowedCharacters;
	}

	/* Getters and setters have to agree on visibility so this is to work around that problem */
	public get preCursor() {
		return this._preCursor;
	}

	public get cursor() {
		return this._cursor;
	}

	public get postCursor() {
		return this._postCursor;
	}

	public home(): void {
		//TODO test this
		while(this.preCursor) {
			this.moveCursorLeft();
		}
	}

	public end(): void {
		//TODO test this
		while(this.postCursor) {
			this.moveCursorRight();
		}
	}

	public backspace(): void {
		this._preCursor = StringService.removeLastCharacterFromString(this._preCursor);
	}

	public delete(): void {
		if(this.moveCursorRight()) {
			this.movePreCursorLeft();
		}
	}

	/**
	 *
	 * @param s One or multiple characters to be added to the console input field
	 * @throws InvalidArgumentException When a character is not in the allowed characters list
	 */
	public addText(s: string) {
		if (!this.characterWhitelist.includes(s)) {
			throw new InvalidArgumentException(`Character '${s}' is not in allowed characters list`)
		}

		this._preCursor += StringService.globalStringReplace(' ', this.WHITESPACE, s);
	}

	/**
	 *
	 * @returns boolean Returns whether or not the cursor was moved one position
	 */
	public moveCursorLeft(): boolean {
		const lastPreCursorChar = StringService.getLastCharacterFromString(this._preCursor);

		if(lastPreCursorChar) {
			this.movePreCursorLeft();
			this.movePostCursorLeft();
			this.changeCursorText(lastPreCursorChar);
		}

		//!! will return true if there is a character, false if the lastPreCursorChar is empty
		return !!(lastPreCursorChar);
	}

	public moveCursorRight(): boolean {
		//get the first character after the cursor OR whitespace if it's empty (e.g. cursor behind text)
		const firstPostCursorChar = StringService.getFirstCharacterFromStringOrDefault(this._postCursor, this.WHITESPACE);

		if(firstPostCursorChar) {
			this.movePreCursorRight();
			this.movePostCursorRight();
			this.changeCursorText(firstPostCursorChar);
		}

		return !!(firstPostCursorChar);
	}

	public onPreCursorChange() {
		return new Observable((observer: Subscriber<string>) => {
			observer.next(this._preCursor);
		});
	}

	public onCursorChange() {
		return new Observable((observer: Subscriber<string>) => {
			observer.next(this._preCursor);
		});
	}

	public onPostCursorChange() {
		return new Observable((observer: Subscriber<string>) => {
			observer.next(this._postCursor);
		});
	}

	private changeCursorText(newCharacter: string): void {
		//this will ensure the cursor has some width, normal spaces are 0 width characters
		if(newCharacter === ' ') {
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
}
