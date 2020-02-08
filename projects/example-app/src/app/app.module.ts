import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { NgrxCleanFormsModule } from 'ngrx-clean-forms';
import { exampleReducer } from './+state/example.reducer';
import { AppComponent } from './app.component';
import { CustomInputComponent } from './custom-input/custom-input.component';

@NgModule({
    declarations: [AppComponent, CustomInputComponent],
    imports: [
        NgrxCleanFormsModule.withConfig({
            throttleTime: 15,
        }),
        BrowserModule,
        StoreModule.forRoot({ example: exampleReducer }),
        StoreDevtoolsModule.instrument({ maxAge: 25 }),
    ],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
