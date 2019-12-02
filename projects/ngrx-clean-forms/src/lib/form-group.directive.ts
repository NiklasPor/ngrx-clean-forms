import {
    AfterViewInit,
    ContentChildren,
    Directive,
    EventEmitter,
    Input,
    OnDestroy,
    Output,
    QueryList,
} from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { SingleControlDirective } from './single-control.directive';
import { FormGroupSummary, FormGroupUpdate } from './types';

@Directive({
    selector: '[libFormGroup]',
})
export class FormGroupDirective implements AfterViewInit, OnDestroy {
    @Input('formSummary$')
    set setFormSummary$(formSummary$: Observable<FormGroupSummary>) {
        this.unsubscribe();
        this.subscriptions.push(formSummary$.subscribe(summary => this.updateSummary(summary)));
    }

    @Output() formUpdate = new EventEmitter<FormGroupUpdate>();

    @ContentChildren(SingleControlDirective) children!: QueryList<SingleControlDirective>;

    subscriptions = new Array<Subscription>();

    constructor() {}

    ngAfterViewInit() {
        this.children.forEach(control => {
            control.formUpdate.subscribe(update =>
                this.formUpdate.next({ controls: { [control.controlKey]: update } })
            );
        });
    }

    updateSummary(summary: FormGroupSummary) {
        if (!this.children) {
            return;
        }

        this.children.forEach(control => {
            control.updateSummary(summary.controls[control.controlKey]);
        });
    }

    unsubscribe() {
        this.subscriptions.forEach(sub => sub && sub.unsubscribe());
    }

    ngOnDestroy() {
        this.unsubscribe();
    }
}
