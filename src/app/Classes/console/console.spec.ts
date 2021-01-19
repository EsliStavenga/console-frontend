import {Console} from './console';
import {InvalidArgumentException} from "../../Exceptions/invalid-argument-exception";
import {inject} from '@angular/core/testing';
import {Injector} from '@angular/core';
import {AppInjectorService} from '../../Services/app-injector.service';
import {Response} from '../../Entities/Response';

const WHITESPACE = '\u00A0';

describe('Console', () => {

	beforeAll(inject([Injector], (injector: Injector) => {
		AppInjectorService.setAppInjector(injector);
	}));

	it('should create an instance', () => {
		expect(new Console([])).toBeTruthy();
	});

	it('should add one character in front of the cursor', () => {
		//arrange
		const c = new Console(['a']);

		//act
		c.addText('a');

		//assert
		expect(c.preCursor).toEqual('a');
		expect(c.cursor).toEqual(WHITESPACE);
		expect(c.postCursor).toEqual('');
	});

	it('should add one character in front of the cursor', () => {
		//arrange
		const c = new Console(['a']);

		//act
		c.addCharacter('a');

		//assert
		expect(c.preCursor).toEqual('a');
		expect(c.cursor).toEqual(WHITESPACE);
		expect(c.postCursor).toEqual('');
	});

	it('should throw an exception because not exactly one character is added', () => {
		//arrange
		const c = new Console('abcdef'.split(''));

		//act
		c.addText('abcdef');

		//assert
		expect(c.preCursor).toEqual('abcdef');
		expect(c.cursor).toEqual(WHITESPACE);
		expect(c.postCursor).toEqual('');
	});

	it('should add each character separately', () => {
		//arrange
		const c = new Console(['a']);

		//act
		expect(() => { c.addCharacter(''); }).toThrow(new InvalidArgumentException('Expected exactly 1 character, 0 specified'));
		expect(() => { c.addCharacter('aa'); }).toThrow(new InvalidArgumentException('Expected exactly 1 character, 2 specified'));
	});


	it('shouldn\'t add any character because there are no allowed characters', () => {
		//arrange
		const c = new Console(['']);

		//act
		expect(() => {
			c.addCharacter('a')
		}).toThrow(new InvalidArgumentException(`Character 'a' is not in allowed characters list`));

		//assert
		expect(c.preCursor).toEqual('');
		expect(c.cursor).toEqual(WHITESPACE);
		expect(c.postCursor).toEqual('');
	});

	it('should move the cursor one character to the left', () => {
		//arrange
		const c = new Console(['a']);
		for (let i = 0; i < 5; i++) {
			c.addText('a');
		}

		//act
		c.moveCursorLeft();

		//assert
		expect(c.preCursor).toEqual('aaaa');
		expect(c.cursor).toEqual('a');
		expect(c.postCursor).toEqual(WHITESPACE);
	});

	it('shouldn\'t move the cursor when going left and the cursor is already at home', () => {
		//arrange
		const c = new Console(['a']);
		for (let i = 0; i < 5; i++) {
			c.addText('a')
		}

		//act
		c.home();
		c.moveCursorLeft();

		//assert
		expect(c.preCursor).toEqual('');
		expect(c.cursor).toEqual('a');
		expect(c.postCursor).toEqual('aaaa' + WHITESPACE);
	});

	it('should move the cursor one character to the right', () => {
		//arrange
		const c = new Console(['a']);
		for (let i = 0; i < 5; i++) {
			c.addText('a')
		}

		//act
		c.home();
		c.moveCursorRight();

		//assert
		expect(c.preCursor).toEqual('a');
		expect(c.cursor).toEqual('a');
		expect(c.postCursor).toEqual('aaa' + WHITESPACE);
	});

	it('shouldn\'t move the cursor one character to the right when there is no text', () => {
		//arrange
		const c = new Console(['']);

		//act
		c.moveCursorRight();

		//assert
		expect(c.preCursor).toEqual(WHITESPACE);
		expect(c.cursor).toEqual(WHITESPACE);
		expect(c.postCursor).toEqual('');
	});

	it('should move the cursor to the start of the input', () => {
		//arrange
		const c = new Console(['a']);
		for (let i = 0; i < 5; i++) {
			c.addText('a')
		}

		//act
		c.home();

		//assert
		expect(c.preCursor).toEqual('');
		expect(c.cursor).toEqual('a');
		expect(c.postCursor).toEqual('aaaa' + WHITESPACE);

	});

	it('should move the cursor to the end of the input', () => {
		//arrange
		const c = new Console(['a']);
		for (let i = 0; i < 5; i++) {
			c.addText('a')
		}

		//act
		c.moveCursorLeft();
		c.end();

		//assert
		expect(c.preCursor).toEqual('aaaaa');
		expect(c.cursor).toEqual(WHITESPACE);
		expect(c.postCursor).toEqual('');
	})

	it('should remove one character in front of the cursor', () => {
		//arrange
		const c = new Console(['0', '1', '2', '3', '4']);
		for (let i = 0; i < 5; i++) {
			c.addText(i.toString())
		}

		//act
		c.backspace();

		//assert
		expect(c.preCursor).toEqual('0123');
		expect(c.cursor).toEqual(WHITESPACE);
		expect(c.postCursor).toEqual('');
	});

	it('should remove one character in front of the cursor without moving the cursor', () => {
		//arrange
		const c = new Console(['a', 'b']);
		c.addText('a');
		c.addText('b');

		//act
		c.moveCursorLeft();
		c.backspace();

		//assert
		expect(c.preCursor).toEqual('');
		expect(c.cursor).toEqual('b');
		expect(c.postCursor).toEqual(WHITESPACE);
	});

	it('should support multiple allowed characters', () => {
		//arrange
		const allowedCharacters = '0123456789';
		const c = new Console(allowedCharacters.split(''));
		c.addText('1');
		c.addText('2');

		//act
		c.moveCursorLeft();
		c.backspace();

		//assert
		expect(c.preCursor).toEqual('');
		expect(c.cursor).toEqual('2');
		expect(c.postCursor).toEqual(WHITESPACE);
	});

	it('should remove one character currently underneath the cursor', () => {
		//arrange
		const c = new Console('abcde'.split(''));

		//act
		c.addText('a');
		c.addText('b');
		c.addText('c');
		c.addText('d');
		c.addText('e');
		c.moveCursorLeft();
		c.delete();

		expect(c.preCursor).toEqual('abcd');
		expect(c.cursor).toEqual(WHITESPACE);
		expect(c.postCursor).toEqual('');
	});

	it('should remove one character behind the cursor', () => {
		//arrange
		const c = new Console('abcde'.split(''));

		//act
		c.addText('a');
		c.addText('b');
		c.addText('c');
		c.addText('d');
		c.addText('e');
		c.moveCursorLeft();
		c.moveCursorLeft();
		c.delete();

		expect(c.preCursor).toEqual('abc');
		expect(c.cursor).toEqual('e');
		expect(c.postCursor).toEqual(WHITESPACE);
	});

	it('should remove the second character from the beginning of the string', () => {
		//arrange
		const c = new Console('abcde'.split(''));

		//act
		c.addText('a');
		c.addText('b');
		c.addText('c');
		c.addText('d');
		c.addText('e');
		c.home();
		c.delete();

		expect(c.preCursor).toEqual('');
		expect(c.cursor).toEqual('b');
		expect(c.postCursor).toEqual('cde' + WHITESPACE);
	});

	it('should clear the entire console', () => {
		//arrange
		const c = new Console('abcde'.split(''));

		//act
		c.addText('a');
		c.addText('b');
		c.addText('c');
		c.addText('d');
		c.addText('e');
		c.home();
		c.delete();
		c.delete();
		c.delete();
		c.delete();
		c.delete();

		expect(c.preCursor).toEqual('');
		expect(c.cursor).toEqual(WHITESPACE);
		expect(c.postCursor).toEqual('');
	});

	it('should not move the cursor', () => {
		//arrange
		const c = new Console('abc'.split(''));

		//act
		c.addText('a');
		c.addText('b');
		c.addText('c');
		c.delete();

		expect(c.preCursor).toEqual('abc');
		expect(c.cursor).toEqual(WHITESPACE);
		expect(c.postCursor).toEqual('');
	});

	it('should transform normal spaces into whitespaces', () => {
		//arrange
		const c = new Console('abc '.split(''));

		//act
		c.addText('ab c');
		c.moveCursorLeft();
		c.moveCursorLeft();

		expect(c.preCursor).toEqual(`ab`);
		expect(c.cursor).toEqual(WHITESPACE);
		expect(c.postCursor).toEqual('c' + WHITESPACE);
	});

	it('should add the command to the history', () => {
		//arrange
		const c = new Console('projects '.split(''));

		//act
		c.addText('projects');
		c.execute();
		c.goBackInHistoryByOne();

		expect(c.preCursor).toEqual('projects');
		expect(c.cursor).toEqual(WHITESPACE);
		expect(c.postCursor).toEqual('');
	});


	it('should go forward in history if there are still items left', () => {
		//arrange
		const c = new Console('projects '.split(''));

		//act
		c.addText('projects');
		c.execute();
		c.goBackInHistoryByOne(); //projects
		c.goForwardInHistoryByOne(); //empty

		expect(c.preCursor).toEqual('');
		expect(c.cursor).toEqual(WHITESPACE);
		expect(c.postCursor).toEqual('');
	});

	it('should not go forward in history if there aren\'t any items left', () => {
		//arrange
		const c = new Console('projects '.split(''));

		//act
		c.addText('projects');
		c.execute();
		c.goBackInHistoryByOne(); //projects
		c.goForwardInHistoryByOne(); //empty
		c.goForwardInHistoryByOne(); //empty
		c.goForwardInHistoryByOne(); //empty
		c.goBackInHistoryByOne(); //projects even tho went forwards thrice

		expect(c.preCursor).toEqual('projects');
		expect(c.cursor).toEqual(WHITESPACE);
		expect(c.postCursor).toEqual('');
	});

	it('should not go backwards in history if there aren\'t any items left', () => {
		//arrange
		const c = new Console('projects'.split(''));

		//act
		c.addText('projects');
		c.execute();
		c.goBackInHistoryByOne(); //projects
		c.goBackInHistoryByOne(); //projects
		c.goBackInHistoryByOne(); //projects
		c.goForwardInHistoryByOne(); //empty even tho went backwards thrice on one item

		expect(c.preCursor).toEqual('');
		expect(c.cursor).toEqual(WHITESPACE);
		expect(c.postCursor).toEqual('');
	});

	it('should save multiple items in history if there aren\'t any items left', () => {
		//arrange
		const c = new Console('projectshl'.split(''));

		//act
		c.addText('projects');
		c.execute();
		c.addText('help');
		c.execute();
		c.addText('test');
		c.execute();

		c.goBackInHistoryByOne(); //test
		c.goBackInHistoryByOne(); //help
		c.goBackInHistoryByOne(); //projects
		c.goForwardInHistoryByOne(); //help

		expect(c.preCursor).toEqual('help');
		expect(c.cursor).toEqual(WHITESPACE);
		expect(c.postCursor).toEqual('');
	});

	it('should show an error icon on failure', () => {
		//arrange
		const c = new Console('thisaprojecdnx-'.split(''));

		//act
		c.addText('this-is-a-project-that-does-not-exist');
		c.execute().then((res) => {

			//assert
			expect(c.showErrorIcon).toBeTrue();
			expect(c.showErrorIcon).toEqual(res);
		});

	});

	it('should capitalise characters when shift is pressed', () => {
		//arrange
		const c = new Console('abc'.split(''));

		//act
		c.addText('aaa');
		c.toggleShiftPressed();
		c.addText('bbb');
		c.toggleShiftPressed();
		c.addText('ccc');

		expect(c.preCursor).toEqual('aaaBBBccc');
	});
});
