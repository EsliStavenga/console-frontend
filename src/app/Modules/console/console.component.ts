import {Component, OnInit, ViewChild} from '@angular/core';
import {ClassListService} from "../../Services/class-list.service";
import {HostListener} from '@angular/core';
import {Console} from "../../Classes/console/console";

@Component({
	selector: 'app-console',
	templateUrl: './console.component.html',
	styleUrls: ['./console.component.scss']
})
export class ConsoleComponent implements OnInit {

	//TODO: 5 minutes AFK dvd bounce
	//TODO random project

	public console: Console;

	@ViewChild('cursorElement')
	private cursorElement;

	private readonly allowedCharacters = 'abcdefghijklmnopqrstuvwxyz0123456789 -="&\\\';'.split('');

	constructor() {
		this.console = new Console(this.allowedCharacters);
	}

	ngOnInit(): void {

	}

	ngAfterViewInit(): void {
		setInterval(() => {
			ClassListService.toggleClass(this.cursorElement.nativeElement, 'active')
		}, 500);
	}

	@HostListener('document:keydown', ['$event'])
	handleKeyboardEvent(event: KeyboardEvent) {
		switch (event.key) {
			case "Backspace":
				this.onBackspacePress();
				break;

			case "Delete":
				this.onDeletePress();
				break;

			case "ArrowLeft":
				this.onLeftPress();
				break;

			case "ArrowRight":
				this.onRightPress();
				break;

			case "Enter":
				this.onEnterPress();
				break;

			case "Home":
				this.onHomePress();
				break;

			case "End":
				this.onEndPress();
				break;

			default:
				this.onTextEntered(event.key);
				//return instead of break so event.preventDefault will be fired
				return;
		}

		event.preventDefault();

	}

	private onHomePress(): void {
		this.console.home();
	}

	private onEndPress(): void {
		this.console.end();
	}

	private onBackspacePress(): void {
		this.console.backspace();
	}

	private onDeletePress(): void {
		this.console.delete();
	}

	private onLeftPress(): void {
		this.console.moveCursorLeft();
	}

	private onRightPress(): void {
		this.console.moveCursorRight();
	}

	private onTextEntered(key: string): void {
		this.console.addText(key);
	}

	private onEnterPress(): void {
		console.log(this.console.preCursor + this.console.cursor + this.console.postCursor);
	}

}
