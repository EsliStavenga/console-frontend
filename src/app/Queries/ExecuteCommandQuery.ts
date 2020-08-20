import {Subscription} from 'rxjs';
import {Injectable} from '@angular/core';
import {Apollo, gql} from 'apollo-angular';


@Injectable({
	providedIn: 'root'
})
export class ExecuteCommandQuery {
	currentUser: any;
	private querySubscription: Subscription;

	private readonly executeCommandQuery = gql`
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

	public constructor(
		private apollo: Apollo
	) {
	}

	public execute(commandToExecute: string): void {
		this.querySubscription = this.apollo
			.watchQuery({
				query: this.executeCommandQuery,
				variables: {
					command: commandToExecute
				},
			})
			.valueChanges.subscribe(({data}) => {
				debugger;
			});
	}
}
