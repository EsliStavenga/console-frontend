import {ComponentFixture, inject, TestBed} from '@angular/core/testing';

import {ConsoleComponent} from './console.component';
import {Injector} from '@angular/core';
import {AppInjectorService} from '../../Services/app-injector.service';
import {Console} from '../../Classes/console/console';

describe('ConsoleComponent', () => {
	let component: ConsoleComponent;
	let fixture: ComponentFixture<ConsoleComponent>;

	beforeEach((() => {
		TestBed.configureTestingModule({
			declarations: [ConsoleComponent]
		})
			.compileComponents();
	}));

	beforeAll(inject([Injector], (injector: Injector) => {
		AppInjectorService.setAppInjector(injector);
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(ConsoleComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
		expect(component.console).toBeTruthy();
		expect(component.console).toBeInstanceOf(Console);
	});

	it('Should not call prevent default on F5 press', () => {
		//arrange
		const keyEvent = new KeyboardEvent('keydown', { key: 'F5' });
		const spy = spyOn(keyEvent, 'preventDefault');

		//act
		component.handleKeyboardEvent(keyEvent);
		fixture.detectChanges();

		//assert
		expect(spy).toHaveBeenCalledTimes(0);
	});

	it('Should not call prevent default on text enter', () => {
		//arrange
		const keyEvent = new KeyboardEvent('keydown', { key: 'a' });
		const spy = spyOn(keyEvent, 'preventDefault');

		//act
		component.handleKeyboardEvent(keyEvent);
		fixture.detectChanges();

		//assert
		expect(spy).toHaveBeenCalledTimes(0);
	});

	it('Should call handle a delete press on Delete press', () => {
		//arrange
		const keyEvent = new KeyboardEvent('keydown', { key: 'Delete' });
		const keyboardSpy = spyOn(keyEvent, 'preventDefault');
		const consoleSpy = spyOn(component.console, 'delete');

		//act
		component.handleKeyboardEvent(keyEvent);
		fixture.detectChanges();

		//assert
		expect(consoleSpy).toHaveBeenCalledTimes(1);
		expect(keyboardSpy).toHaveBeenCalledTimes(1);
	});

	it('Should go back in history on ArrowUp press', () => {
		//arrange
		const keyEvent = new KeyboardEvent('keydown', { key: 'ArrowUp' });
		const keyboardSpy = spyOn(keyEvent, 'preventDefault');
		const consoleSpy = spyOn(component.console, 'goBackInHistoryByOne');

		//act
		component.handleKeyboardEvent(keyEvent);
		fixture.detectChanges();

		//assert
		expect(consoleSpy).toHaveBeenCalledTimes(1);
		expect(keyboardSpy).toHaveBeenCalledTimes(1);
	});

	it('Should go forward in history on ArrowDown press', () => {
		//arrange
		const keyEvent = new KeyboardEvent('keydown', { key: 'ArrowDown' });
		const keyboardSpy = spyOn(keyEvent, 'preventDefault');
		const consoleSpy = spyOn(component.console, 'goForwardInHistoryByOne');

		//act
		component.handleKeyboardEvent(keyEvent);
		fixture.detectChanges();

		//assert
		expect(consoleSpy).toHaveBeenCalledTimes(1);
		expect(keyboardSpy).toHaveBeenCalledTimes(1);
	});

	it('Should move the cursor around on ArrowLeft press', () => {
		//arrange
		const keyEvent = new KeyboardEvent('keydown', { key: 'ArrowLeft' });
		const keyboardSpy = spyOn(keyEvent, 'preventDefault');
		const consoleSpy = spyOn(component.console, 'moveCursorLeft');

		//act
		component.handleKeyboardEvent(keyEvent);
		fixture.detectChanges();

		//assert
		expect(consoleSpy).toHaveBeenCalledTimes(1);
		expect(keyboardSpy).toHaveBeenCalledTimes(1);
	});

	it('Should call prevent default on ArrowRight press', () => {
		//arrange
		const keyEvent = new KeyboardEvent('keydown', { key: 'ArrowRight' });
		const keyboardSpy = spyOn(keyEvent, 'preventDefault');
		const consoleSpy = spyOn(component.console, 'moveCursorRight');

		//act
		component.handleKeyboardEvent(keyEvent);
		fixture.detectChanges();

		//assert
		expect(consoleSpy).toHaveBeenCalledTimes(1);
		expect(keyboardSpy).toHaveBeenCalledTimes(1);
	});

	it('Should execute the command on Enter press', () => {
		//arrange
		const keyEvent = new KeyboardEvent('keydown', { key: 'Enter' });
		const keyboardSpy = spyOn(keyEvent, 'preventDefault');
		const consoleSpy = spyOn(component.console, 'execute');

		//act
		component.handleKeyboardEvent(keyEvent);
		fixture.detectChanges();

		//assert
		expect(consoleSpy).toHaveBeenCalledTimes(1);
		expect(keyboardSpy).toHaveBeenCalledTimes(1);
	});

	it('Should go to the start of the input on Home press', () => {
		//arrange
		const keyEvent = new KeyboardEvent('keydown', { key: 'Home' });
		const keyboardSpy = spyOn(keyEvent, 'preventDefault');
		const consoleSpy = spyOn(component.console, 'home');

		//act
		component.handleKeyboardEvent(keyEvent);
		fixture.detectChanges();

		//assert
		expect(consoleSpy).toHaveBeenCalledTimes(1);
		expect(keyboardSpy).toHaveBeenCalledTimes(1);
	});

	it('Should go to the back of the input on End press', () => {
		//arrange
		const keyEvent = new KeyboardEvent('keydown', { key: 'End' });
		const keyboardSpy = spyOn(keyEvent, 'preventDefault');
		const consoleSpy = spyOn(component.console, 'end');

		//act
		component.handleKeyboardEvent(keyEvent);
		fixture.detectChanges();

		//assert
		expect(consoleSpy).toHaveBeenCalledTimes(1);
		expect(keyboardSpy).toHaveBeenCalledTimes(1);
	});

});
