import {inject} from '@angular/core/testing';
import {Injector} from '@angular/core';
import {AppInjectorService} from '../Services/app-injector.service';
import {Part} from './Part';
import {StringService} from '../Services/string.service';

describe('Entity\\Part', () => {

	beforeAll(inject([Injector], (injector: Injector) => {
		AppInjectorService.setAppInjector(injector);
	}));

	it('should create an instance', () => {
		expect(new Part({foregroundColor: '', content: ''})).toBeTruthy();
	});

	it('should correctly set the foreground color', () => {
		//arrange
		const color = 'C3C3C3';

		//act
		const part = new Part({foregroundColor: color, content: ''});

		//assert
		expect(part.foregroundColor).toEqual(color);
	});

	it('should correctly set the foreground color without a hashtag', () => {
		//arrange
		const color = 'C3C3C3';

		//act
		const part = new Part({foregroundColor: `#${color}`, content: ''});

		//assert
		expect(part.foregroundColor).toEqual(color);
	});

	it('should correctly set the content', () => {
		//arrange
		const content = 'hello i am a content';

		//act
		const part = new Part({foregroundColor: '', content: content});

		//assert
		expect(part.content).toEqual(content);
	});

	it('should correctly set the content and color', () => {
		//arrange
		const content = 'hello i am a content';
		const color  = 'C3C3C3';

		//act
		const part = new Part({foregroundColor: color, content: content});

		//assert
		expect(part.content).toEqual(content);
		expect(part.foregroundColor).toEqual(color);
	});

	it('should use the getColWidth method in StringService', () => {
		//arrange
		const charLimit = 100;
		const content = '';

		//act
		const part = new Part({foregroundColor: '', content: content});

		//assert
		for(let i = 0; i < charLimit; i++) {
			part.content += i;
			expect(part.getColWidth()).toEqual(StringService.getColWidth(part.content));
		}
	});

});
