import {Console} from './console';
import {InvalidArgumentException} from "../../Exceptions/invalid-argument-exception";

const WHITESPACE = '\u00A0';

describe('Console', () => {
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

	it('shouldn\'t add any character because there are no allowed characters', () => {
		//arrange
		const c = new Console(['']);

		//act
		expect(() => {
			c.addText('a')
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
		expect(c.preCursor).toEqual('');
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
		const c = new Console(['a']);
		for (let i = 0; i < 5; i++) {
			c.addText('a')
		}

		//act
		c.backspace();

		//assert
		expect(c.preCursor).toEqual('aaaa');
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

});
