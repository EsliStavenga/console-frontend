import {inject} from '@angular/core/testing';
import {Injector} from '@angular/core';
import {AppInjectorService} from '../Services/app-injector.service';
import {Command} from './Command';

describe('Entity\\Command', () => {

	beforeAll(inject([Injector], (injector: Injector) => {
		AppInjectorService.setAppInjector(injector);
	}));

	it('should create an instance', () => {
		expect(new Command()).toBeTruthy();
	});

});
