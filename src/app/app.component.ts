import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from './+state/app.state';
import { increment } from './+state/example.actions';
import { selectTest } from './+state/example.selectors';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent {
    test$ = this.store.select(selectTest);

    constructor(private store: Store<AppState>) {}

    increment() {
        this.store.dispatch(increment());
    }
}
