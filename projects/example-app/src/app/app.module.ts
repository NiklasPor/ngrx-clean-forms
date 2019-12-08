import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { NgrxCleanFormsModule } from 'projects/ngrx-clean-forms/src/public-api';
import { environment } from 'projects/example-app/src/environments/environment';
import { exampleReducer } from './+state/example.reducer';
import { AppComponent } from './app.component';
import { CustomInputComponent } from './custom-input/custom-input.component';

@NgModule({
    declarations: [AppComponent, CustomInputComponent],
    imports: [
        NgrxCleanFormsModule,
        BrowserModule,
        StoreModule.forRoot({ example: exampleReducer }),
        StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: environment.production }),
    ],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
