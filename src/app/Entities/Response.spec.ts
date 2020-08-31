import {inject} from '@angular/core/testing';
import {Injector} from '@angular/core';
import {AppInjectorService} from '../Services/app-injector.service';
import {Part} from './Part';
import {StringService} from '../Services/string.service';
import {Response} from './Response';
import {ResponseLine} from './ResponseLine';

describe('Entity\\Response', () => {

	beforeAll(inject([Injector], (injector: Injector) => {
		AppInjectorService.setAppInjector(injector);
	}));

	it('should create an instance', () => {
		expect(new Response({title: '', responseLines: []})).toBeTruthy();
	});

	it('should correctly set title', () => {
		//arrange
		const title = 'Projects';

		//act
		const response = new Response({title: title, responseLines: []});

		//assert
		expect(response.title).toEqual(title);
	});

	it('should correctly set the responseLines', () => {
		//arrange
		const responseLines = [{parts: [{content: '', foregroundColor: ''}]}];

		//act
		const response = new Response({title: '', responseLines: responseLines});

		//assert
		expect(response.responseLines.length).toEqual(responseLines.length);
	});

	it('should correctly handle no responseLines', () => {
		//arrange
		const title = 'Projects';

		//act
		const response = new Response({title: title});

		//assert
		expect(response.responseLines.length).toEqual(0);
	});

	it('should correctly set the title and responseLines', () => {
		//arrange
		const title = 'Projects';
		const responseLines = [{parts: [{content: '', foregroundColor: ''}]}];

		//act
		const response = new Response({title: title, responseLines: responseLines});

		//assert
		expect(response.title).toEqual(title);
		expect(response.responseLines.length).toEqual(responseLines.length);
	});

	it('should create instances of ResponseLine for the responseLines', () => {
		//arrange
		const responseLines = [{parts: [{content: '', foregroundColor: ''}]}];

		//act
		const response = new Response({title: '', responseLines: responseLines});

		//assert
		expect(response.responseLines[0]).toBeInstanceOf(ResponseLine);
	});

	it('should use the getColWidth method in StringService', () => {
		//arrange
		const charLimit = 100;
		const responseLines = [{parts: [{content: '', foregroundColor: ''}]}];

		//act
		const response = new Response({title: '', responseLines: responseLines});

		//assert
		for(let i = 0; i < charLimit; i++) {
			response.title += i;
			expect(response.getColWidth()).toEqual(StringService.getColWidth(response.title));
		}

	});
});
