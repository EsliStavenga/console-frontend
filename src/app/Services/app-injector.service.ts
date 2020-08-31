import {Injectable, Injector} from '@angular/core';

/**
 * Helper to access the exported {@link AppInjector}, needed as ES6 modules export
 * immutable bindings; see http://2ality.com/2015/07/es6-module-exports.html
 */
@Injectable({
	providedIn: 'root'
})
export class AppInjectorService {
	private static _AppInjector: Injector;

	public static get AppInjector()
	{
		return this._AppInjector;
	}

	public static setAppInjector(injector: Injector): void {
		if (!this._AppInjector) {
			this._AppInjector = injector;
		}
	}
}
