import { Component, ViewChild, OnInit, ElementRef } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from './+state/app.state';
import { increment, updateSingleFormControl, updateFormGroup } from './+state/example.actions';
import { selectTest, selectSingleInput, selectFormGroup } from './+state/example.selectors';
import { map } from 'rxjs/operators';
import { FormControlUpdate, FormGroupUpdate } from 'projects/ngrx-clean-forms/src/lib/types';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
    singleInput$ = this.store.select(selectSingleInput);
    formGroup$ = this.store.select(selectFormGroup);

    constructor(private store: Store<AppState>) {}

    ngOnInit() {}

    updateSingleInput(controlUpdate: FormControlUpdate<any>) {
        this.store.dispatch(updateSingleFormControl({ update: controlUpdate }));
    }

    updatFormGroup(update: FormGroupUpdate) {
        this.store.dispatch(updateFormGroup({ update }));
    }
}
