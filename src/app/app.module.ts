import { exampleReducer, ExampleState } from './+state/example.reducer';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { StoreModule } from '@ngrx/store';

@NgModule({
    declarations: [AppComponent],
    imports: [BrowserModule, StoreModule.forRoot({ example: exampleReducer })],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
