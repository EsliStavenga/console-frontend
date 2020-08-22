import {Injectable} from '@angular/core';

@Injectable({
	providedIn: 'root'
})
export class MathService {

	public static clamp(value, min, max) {
		return Math.min(max, Math.max(min, value));
	}
}
