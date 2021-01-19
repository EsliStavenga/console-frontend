import {Command} from '../Command';
import {ICommand} from '../ICommand';

@ICommand.register
export class ChangeDirectoryCommand extends Command {

	public command: string = 'cd';
	public help: string = 'Change the directory';

	public execute = (): Command => {
		return this;
	};


}
