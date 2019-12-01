import { exampleReducer, ExampleState } from './+state/example.reducer';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { AppComponent } from './app.component';
import { StoreModule } from '@ngrx/store';
import { environment } from 'src/environments/environment';
import { NgrxCleanFormsModule } from 'projects/ngrx-clean-forms/src/lib/ngrx-clean-forms/ngrx-clean-forms.module';

@NgModule({
    declarations: [AppComponent],
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
