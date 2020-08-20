import {BrowserModule} from '@angular/platform-browser';
import {Injector, NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {NavbarComponent} from './Modules/navbar/navbar.component';
import { ConsoleComponent } from './Modules/console/console.component';
import { HttpClientModule } from '@angular/common/http';
import { GraphQLModule } from './graphql.module';
export let AppInjector: Injector;

@NgModule({
	declarations: [
		AppComponent,
		NavbarComponent,
		ConsoleComponent
	],
	imports: [
		BrowserModule,
		AppRoutingModule,
		HttpClientModule,
		GraphQLModule
	],
	providers: [],
	bootstrap: [AppComponent]
})
export class AppModule {

	constructor(private injector: Injector) {
		AppInjector = this.injector;
	}

}
