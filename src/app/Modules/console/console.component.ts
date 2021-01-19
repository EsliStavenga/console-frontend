import {Component, OnInit, ViewChild} from '@angular/core';
import {ClassListService} from '../../Services/class-list.service';
import {HostListener} from '@angular/core';
import {Console} from '../../Classes/console/console';

@Component({
	selector: 'app-console',
	templateUrl: './console.component.html',
	styleUrls: ['./console.component.scss']
})
export class ConsoleComponent implements OnInit {

	//TODO: 5 minutes AFK dvd bounce
	//TODO random project
	//TODO: tab
	//TODO: clippy

	public console: Console;

	@ViewChild('cursorElement')
	private cursorElement;

	private readonly allowedCharacters = 'abcdefghijklmnopqrstuvwxyz0123456789 -="^&\\\'~/;'.split('');

	constructor() {
		this.console = new Console(this.allowedCharacters);
	}

	ngOnInit(): void {

	}

	ngAfterViewInit(): void {
		setInterval(() => {
			ClassListService.toggleClass(this.cursorElement.nativeElement, 'active');
		}, 500);
	}

	@HostListener('document:keydown', ['$event'])
	handleKeyboardEventKeyDown(event: KeyboardEvent) {
		switch (event.key) {
			case 'ArrowUp':
				this.onArrowUpPress();
				break;

			case 'Shift':
				this.onShiftPress();
				break;

			case 'CapsLock':
				this.onCapsPress();
				break;

			case 'Control':
				this.onControlPress();
				break;

			case 'Tab':
			case 'Alt':
				break;

			case 'ArrowDown':
				this.onArrowDownPress();
				break;

			case 'Backspace':
				this.onBackspacePress();
				break;

			case 'Delete':
				this.onDeletePress();
				break;

			case 'ArrowLeft':
				this.onLeftPress();
				break;

			case 'ArrowRight':
				this.onRightPress();
				break;

			case 'Enter':
				this.onEnterPress();
				break;

			case 'Home':
				this.onHomePress();
				break;

			case 'End':
				this.onEndPress();
				break;

			case 'F5':
				return;

			default:
				//don't parse F11 and stuff
				if(event.key.length > 1) {
					return;
				}

				this.onTextEntered(event.key);
				break;
		}

		event.preventDefault();

	}

	@HostListener('document:keyup', ['$event'])
	handleKeyboardEventKeyUp(event: KeyboardEvent) {
		switch(event.key) {
			case 'Shift':
				this.onShiftRelease();
				break;

			case 'Control':
				this.onControlRelease();
				break;
		}

		event.preventDefault();
	}

	@HostListener('window:blur', ['$event'])
	onBlur(event: any): void {
		//when the user switches view, disable all key presses just in case
		this.console.clearAllKeysPressed();
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
		this.console.execute();
	}

	private onArrowUpPress() {
		this.console.goBackInHistoryByOne();
	}

	private onArrowDownPress() {
		this.console.goForwardInHistoryByOne();
	}

	private onShiftPress() {
		this.console.isShiftPressed = true;
	}

	private onShiftRelease() {
		this.console.isShiftPressed = false;
	}

	private onCapsPress() {
		this.console.toggleCapsLockPressed()
	}

	private onControlPress() {
		this.console.isControlPressed = true;
	}

	private onControlRelease() {
		this.console.isControlPressed = false;
	}
}
