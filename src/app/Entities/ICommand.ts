import {Response} from './Response';
import {Command} from './Command';

export interface ICommand {

	command: string;
	help: string;

	execute(): Command;

}


// add a registry of the type you expect
export namespace ICommand {
	type Constructor<T> = {
		new(...args: any[]): T;
		readonly prototype: T;
	}
	const implementations: Constructor<ICommand>[] = [];
	export function GetImplementations(): Constructor<ICommand>[] {
		return implementations;
	}
	export function register<T extends Constructor<ICommand>>(ctor: T) {
		implementations.push(ctor);
		return ctor;
	}
}
