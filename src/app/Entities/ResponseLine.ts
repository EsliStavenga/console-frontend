import {Part} from './Part';

export class ResponseLine {

	public parts: Part[] = [];

	public constructor(data: { parts: any[] }) {
		data.parts.forEach(part => {
			this.parts.push(
				new Part(part)
			)
		});
	}

}
