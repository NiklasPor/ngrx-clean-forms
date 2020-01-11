import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { FormControlUpdate, FormGroupUpdate } from 'ngrx-clean-forms';
import { AppState } from './+state/app.state';
import * as ExampleActions from './+state/example.actions';
import * as ExampleSelectors from './+state/example.selectors';
import { ExampleFormControls, StateAccessExampleFormControls } from './+state/example.reducer';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, AfterViewInit {
    singleInput$ = this.store.select(ExampleSelectors.selectSingleInput);
    formGroup$ = this.store.select(ExampleSelectors.selectFormGroup);
    stateAccessFormGroup$ = this.store.select(ExampleSelectors.selectStateAccessExampleGroup);
    forbiddenNumber$ = this.store.select(ExampleSelectors.selectForbiddenNumber);

    constructor(private store: Store<AppState>) {}

    ngOnInit() {}

    updateSingleInput(controlUpdate: FormControlUpdate<string>) {
        this.store.dispatch(ExampleActions.updateSingleFormControl({ update: controlUpdate }));
    }

    updateFormGroup(update: FormGroupUpdate<ExampleFormControls>) {
        this.store.dispatch(ExampleActions.updateFormGroup({ update }));
    }

    updateStateAccessFormGroup(update: FormGroupUpdate<StateAccessExampleFormControls>) {
        this.store.dispatch(ExampleActions.updateStateAccessExampleFormGroup({ update }));
    }

    ngAfterViewInit() {}
}
