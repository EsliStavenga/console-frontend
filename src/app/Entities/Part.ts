import {MathService} from '../Services/math.service';
import {StringService} from '../Services/string.service';

export class Part {

	public foregroundColor: string; //hex foregroundn color
	public content: string;

	public constructor(data: { foregroundColor: string, content: string }) {
		this.foregroundColor = StringService.leftTrim(data.foregroundColor, '#');
		this.content = data.content;
	}

	public getColWidth(multiplier: number = 1): number {
		return StringService.getColWidth(this.content, multiplier);
	}
}
