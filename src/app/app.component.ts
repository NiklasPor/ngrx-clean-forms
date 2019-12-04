import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { FormControlUpdate, FormGroupUpdate } from 'projects/ngrx-clean-forms/src/lib/types';
import { AppState } from './+state/app.state';
import { updateFormGroup, updateSingleFormControl } from './+state/example.actions';
import { selectFormGroup, selectSingleInput } from './+state/example.selectors';
import { tap } from 'rxjs/operators';
import { Validators, AbstractControl } from '@angular/forms';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, AfterViewInit {
    singleInput$ = this.store.select(selectSingleInput);
    formGroup$ = this.store.select(selectFormGroup);

    constructor(private store: Store<AppState>) {}

    ngOnInit() {}

    updateSingleInput(controlUpdate: FormControlUpdate<any>) {
        this.store.dispatch(updateSingleFormControl({ update: controlUpdate }));
    }

    updateFormGroup(update: FormGroupUpdate) {
        this.store.dispatch(updateFormGroup({ update }));
    }

    ngAfterViewInit() {}
}
