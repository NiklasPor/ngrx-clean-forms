import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { FormArrayUpdate, FormControlUpdate, FormGroupUpdate } from 'ngrx-clean-forms';
import { AppState } from './+state/app.state';
import * as ExampleActions from './+state/example.actions';
import { ExampleGroupControls, StateAccessExampleFormControls } from './+state/example.reducer';
import * as ExampleSelectors from './+state/example.selectors';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, AfterViewInit {
    state$ = this.store.select(ExampleSelectors.selectExample);
    singleInput$ = this.store.select(ExampleSelectors.selectSingleInput);
    formGroup$ = this.store.select(ExampleSelectors.selectFormGroup);
    stateAccessFormGroup$ = this.store.select(ExampleSelectors.selectStateAccessExampleGroup);
    forbiddenNumber$ = this.store.select(ExampleSelectors.selectForbiddenNumber);
    formArray$ = this.store.select(ExampleSelectors.selectArray);

    constructor(private store: Store<AppState>) {}

    ngOnInit() {}

    updateSingleInput(controlUpdate: FormControlUpdate<string>) {
        this.store.dispatch(ExampleActions.updateSingleFormControl({ update: controlUpdate }));
    }

    updateFormGroup(update: FormGroupUpdate<ExampleGroupControls>) {
        this.store.dispatch(ExampleActions.updateFormGroup({ update }));
    }

    updateFormArray(update: FormArrayUpdate<string>) {
        this.store.dispatch(ExampleActions.updateFormArray({ update }));
    }

    updateStateAccessFormGroup(update: FormGroupUpdate<StateAccessExampleFormControls>) {
        this.store.dispatch(ExampleActions.updateStateAccessExampleFormGroup({ update }));
    }

    addControlToArray() {
        this.store.dispatch(ExampleActions.addControlToArray());
    }

    ngAfterViewInit() {}
}
