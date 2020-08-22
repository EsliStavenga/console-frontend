import {Injectable} from '@angular/core';
import {Apollo, gql} from 'apollo-angular';
import {DocumentNode} from 'graphql';
import {Response} from '../Entities/Response';
import {InvalidArgumentException} from '../Exceptions/invalid-argument-exception';


@Injectable({
	providedIn: 'root'
})
export class BaseQuery {
	public query: DocumentNode;

	public constructor(
		protected apollo: Apollo
	) {
	}

	protected sendRequest(variables: { command: string }): Promise<Response> {
		if (!this.query) {
			throw new InvalidArgumentException('No query defined');
		}

		return new Promise((resolve) => {
			this.apollo
				.watchQuery({
					query: this.query,
					variables: variables,
				})
				.valueChanges
				.subscribe(({data}) => {

					const commandData = data[Object.keys(data)[0]];
					let response;

					if(commandData === null) {
						response = this.generateError(variables);
					} else {
						response = new Response(commandData);
					}
					resolve(response);
				});
		})


	}

	private generateError(variables: { command: string }) {
		return new Response({
			'title': variables.command,
			'responseLines': [
				{

					'parts': [{
						'content': `Error: The command '${variables.command}' was not found`,
						'foregroundColor': '8a2828'
					}]
				}
			]
		});
	}
}
