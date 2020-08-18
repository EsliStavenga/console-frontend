import {gql} from '@apollo/client';
import {Subscription} from 'rxjs';
import {Apollo} from 'apollo-angular';
import {Injectable} from "@angular/core";

const executeCommandQuery = gql`
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

@Injectable({
	providedIn: 'root'
})
export class ExecuteCommandQuery {
	currentUser: any;
	private querySubscription: Subscription;

	public constructor(
		private apollo: Apollo
	) {
	}

	private execute(commandToExecute: string): void {
		this.querySubscription = this.apollo
			.watchQuery({
				query: executeCommandQuery,
				variables: {
					command: commandToExecute
				},
			})
			.valueChanges.subscribe(({data}) => {
				debugger;
			});
	}
}
