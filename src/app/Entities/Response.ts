import {ResponseLine} from './ResponseLine';
import {MathService} from '../Services/math.service';
import {StringService} from '../Services/string.service';

export class Response {

	public title: string;
	public responseLines: ResponseLine[] = [];

	public constructor(data: {title: string, responseLines?: any[] }) {
		this.title = data.title;

		if(!data.responseLines) {
			return;
		}

		data.responseLines.forEach(line => {
			this.responseLines.push(
				new ResponseLine(line)
			)
		});
	}

	public getColWidth(multiplier: number = 1): number {
		return StringService.getColWidth(this.title, multiplier);
	}

}
