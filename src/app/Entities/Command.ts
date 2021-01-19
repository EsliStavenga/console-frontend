import {Response} from './Response';

export class Command {

	public hasFailed: boolean = false;
	/**
	 * The command with the arguments
	 */
	public fullCommand: string;
	public response: Response = undefined;
	public path: string;

}
