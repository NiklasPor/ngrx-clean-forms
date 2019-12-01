import { Component, ViewChild, OnInit, ElementRef } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from './+state/app.state';
import { increment, updateSingleFormControl } from './+state/example.actions';
import { selectTest, selectForm } from './+state/example.selectors';
import { map } from 'rxjs/operators';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
    singleInputValue$ = this.store.select(selectForm).pipe(map(form => form));

    @ViewChild('singleInput', { static: true }) singleInput: ElementRef;

    constructor(private store: Store<AppState>) {}

    ngOnInit() {
        this.store.select(selectForm).subscribe(summary => {
            this.singleInput.nativeElement.value = summary.value;
        });
    }

    updateSingleInput(value: string) {
        this.store.dispatch(updateSingleFormControl({ update: { value } }));
    }
}
