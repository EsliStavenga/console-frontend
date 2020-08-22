import {MathService} from '../Services/math.service';
import {StringService} from '../Services/string.service';

export class Part {

	public foregroundColor: string; //hex foregroundn color
	public content: string;

	public constructor(data: any) {
		this.foregroundColor = data.foregroundColor;
		this.content = data.content;
	}

	public getColWidth(): number {
		return StringService.getColWidth(this.content);
	}
}
