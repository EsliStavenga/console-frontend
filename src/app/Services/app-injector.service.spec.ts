import {inject, TestBed} from '@angular/core/testing';
import {AppInjectorService} from './app-injector.service';
import {Injector} from '@angular/core';


describe('AppInjectorService', () => {
	let service: AppInjectorService;

	beforeAll(inject([Injector], (injector: Injector) => {
		AppInjectorService.setAppInjector(injector);
	}));

	beforeEach(() => {
		TestBed.configureTestingModule({});
		service = TestBed.inject(AppInjectorService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});

	it('should have a valid AppInjector', () => {
		expect(AppInjectorService.AppInjector).toBeDefined();
		expect(AppInjectorService.AppInjector).not.toBeNull();
	});
});
