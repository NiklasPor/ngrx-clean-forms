import { Component, ViewChild, OnInit, ElementRef } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from './+state/app.state';
import { increment, updateSingleFormControl } from './+state/example.actions';
import { selectTest, selectForm } from './+state/example.selectors';
import { map } from 'rxjs/operators';
import { FormControlUpdate } from 'projects/ngrx-clean-forms/src/lib/types';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
    singleInputValue$ = this.store.select(selectForm);

    constructor(private store: Store<AppState>) {}

    ngOnInit() {}

    updateSingleInput(controlUpdate: FormControlUpdate<any>) {
        this.store.dispatch(updateSingleFormControl({ update: controlUpdate }));
    }
}
