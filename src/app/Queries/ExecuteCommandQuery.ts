import {Injectable} from '@angular/core';
import {gql} from 'apollo-angular';
import {BaseQuery} from './BaseQuery';
import {Response} from '../Entities/Response';
import {IQuery} from './IQuery';


@Injectable({
	providedIn: 'root'
})
export class ExecuteCommandQuery extends BaseQuery implements IQuery {

	public query = gql`
		query execute_command($command: String!) {
			execute_command(command: $command) {
				title
				responseLines {
					parts {
						foregroundColor
						content
					}
				}
			}
		}
	`;

	public execute(commandToExecute: string): Promise<Response> {
		return this.sendRequest({
			command: commandToExecute
		});
	}
}
