import {Injectable} from '@angular/core';
import {MathService} from './math.service';

@Injectable({
	providedIn: 'root'
})
export abstract class StringService {

	public static removeFirstCharacterFromString(s: string): string {
		return this.removeFromStartOfString(s, 1);
	}

	public static removeLastCharacterFromString(s: string): string {
		return this.removeFromEndOfString(s, 1);
	}

	public static removeFromStartOfString(s: string, charCount: number): string {
		return s.substr(charCount, s.length - charCount);
	}

	public static removeFromEndOfString(s: string, charCount: number): string {
		return s.substr(0, s.length - charCount);
	}

	public static getFirstCharacterFromString(s: string): string {
		return s.charAt(0);
	}

	public static getLastCharacterFromString(s: string): string {
		return s.substr(s.length - 1, 1);
	}

	public static getFirstCharacterFromStringOrDefault(s: string, _default: string = null): string | null {
		const r =  this.getFirstCharacterFromString(s);
		return r ? r : _default;
	}

	public static getLastCharacterFromStringOrDefault(s: string, _default: string = null): string | null {
		const r =  this.getLastCharacterFromString(s);
		return r ? r : _default;
	}

	public static globalStringReplace(needle: string, replace: string, haystack: string): string {
		const regex = new RegExp(needle, "g");
		return haystack.replace(regex, replace);
	}

	public static getColWidth(s: string, multiplier: number = 1): number {
		return Math.floor(MathService.clamp(s.length * multiplier / 16, 1, 12));
	}

	public static leftTrim(s: string, charToRemove: string): string {
		return s.replace(new RegExp(`^${charToRemove}+`, 'i'), '');
	}

	public static rightTrim(s: string, charToRemove: string): string {
		return s.replace(new RegExp(`${charToRemove}+$`, 'i'), '');
	}
}
