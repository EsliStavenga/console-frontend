import {inject, TestBed} from '@angular/core/testing';

import {StringService} from './string.service';
import {Injector} from '@angular/core';
import {AppInjectorService} from './app-injector.service';

describe('StringService', () => {
	let service: StringService;

	beforeEach(() => {
		TestBed.configureTestingModule({});
		service = TestBed.inject(StringService);
	});

	beforeAll(inject([Injector], (injector: Injector) => {
		AppInjectorService.setAppInjector(injector);
	}));

	it('should be created', () => {
		expect(service).toBeTruthy();
	});

	it('should return the last character from a string', () => {
		//arrange
		const s = '12345';

		//act
		const r = StringService.getLastCharacterFromString(s);

		//assert
		expect(r).toEqual('5');
	});

	it('should return default ', () => {
		//arrange
		const s = '';
		const d = '12345';

		//act
		const r = StringService.getLastCharacterFromStringOrDefault(s, d);

		//assert
		expect(r).toEqual(d);
	});

	it('should return the first character from a string', () => {
		//arrange
		const s = '12345';

		//act
		const r = StringService.getFirstCharacterFromStringOrDefault(s);

		//assert
		expect(r).toEqual('1');
	});

	it('should return default', () => {
		//arrange
		const s = '';
		const d = '12345';

		//act
		const r = StringService.getFirstCharacterFromStringOrDefault(s, d);

		//assert
		expect(r).toEqual(d);
	});

	it('should trim this character from the end of the given string', () => {
		//arrange
		const s = 'aaa12345aaa';
		const d = 'aaa12345';

		//act
		const r = StringService.rightTrim(s, 'a');

		//assert
		expect(r).toEqual(d);
	});

	it('should not trim this character from the end of the given string if it does not exist', () => {
		//arrange
		const s = 'aaa12345';
		const d = 'aaa12345';

		//act
		const r = StringService.rightTrim(s, 'a');

		//assert
		expect(r).toEqual(d);
	});

	it('should trim this character from the start of the given string', () => {
		//arrange
		const s = 'aaa12345aaa';
		const d = '12345aaa';

		//act
		const r = StringService.leftTrim(s, 'a');

		//assert
		expect(r).toEqual(d);
	});

	it('should not trim this character from the start of the given string if it does not exist', () => {
		//arrange
		const s = '12345aaa';
		const d = '12345aaa';

		//act
		const r = StringService.leftTrim(s, 'a');

		//assert
		expect(r).toEqual(d);
	});

	it('should calculate the width of the column by taking the text length / 16', () => {
		//arrange
		const s1 = '123456890123456';
		const s2 =  '12345689012345671234568901234567';

		//act
		const r1 = StringService.getColWidth(s1);
		const r2 = StringService.getColWidth(s2);

		//assert
		expect(r1).toEqual(1);
		expect(r2).toEqual(2);
	});

	it('should calculate the width of the column by taking the text length / 16 with the given multiplier', () => {
		//arrange
		const s1 = '1234568901234567';
		const s2 =  '12345689012345671234568901234567';

		//act
		const r1 = StringService.getColWidth(s1, 2);
		const r2 = StringService.getColWidth(s2, 2);

		//assert
		expect(r1).toEqual(2);
		expect(r2).toEqual(4);
	});

	it('should remove all occurences of the substring in the string', () => {
		//arrange
		const s = 'hello I am a test string';

		//act
		const r = StringService.globalStringReplace('a', 'b', s);

		//assert
		expect(r).toEqual('hello I bm b test string');
	});

	it('should not alter the string if the given substring does not occur', () => {
		//arrange
		const s = 'hello I am a test string';

		//act
		const r = StringService.globalStringReplace('b', 'a', s);

		//assert
		expect(r).toEqual(s);
	});

	it('should remove x characters from the end of the string', () => {
		//arrange
		const s = 'hello I am a test string';

		//act
		const r1 = StringService.removeFromEndOfString(s, 1);
		const r2 = StringService.removeFromEndOfString(s, 5);
		const r3 = StringService.removeFromEndOfString(s, 10);

		//assert
		expect(r1.length).toEqual(s.length - 1);
		expect(r2.length).toEqual(s.length - 5);
		expect(r3.length).toEqual(s.length - 10);
		expect(r1).toEqual('hello I am a test strin');
		expect(r2).toEqual('hello I am a test s');
		expect(r3).toEqual('hello I am a t');
	});

	it('should remove x characters from the start of the string', () => {
		//arrange
		const s = 'hello I am a test string';

		//act
		const r1 = StringService.removeFromStartOfString(s, 1);
		const r2 = StringService.removeFromStartOfString(s, 5);
		const r3 = StringService.removeFromStartOfString(s, 10);

		//assert
		expect(r1.length).toEqual(s.length - 1);
		expect(r2.length).toEqual(s.length - 5);
		expect(r3.length).toEqual(s.length - 10);
		expect(r1).toEqual('ello I am a test string');
		expect(r2).toEqual(' I am a test string');
		expect(r3).toEqual(' a test string');
	});

	it('should remove 1 character from the start of the string', () => {
		//arrange
		const s = 'hello I am a test string';

		//act
		const r = StringService.removeFirstCharacterFromString(s);
		const a = StringService.removeFromStartOfString(s, 1)

		//assert
		expect(r.length).toEqual(a.length);
		expect(r).toEqual(a);
	});

	it('should remove 1 character from the end of the string', () => {
		//arrange
		const s = 'hello I am a test string';

		//act
		const r = StringService.removeLastCharacterFromString(s);
		const a = StringService.removeFromEndOfString(s, 1)

		//assert
		expect(r.length).toEqual(a.length);
		expect(r).toEqual(a);
	});


});
