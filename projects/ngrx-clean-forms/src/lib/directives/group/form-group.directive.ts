import { AfterViewInit, Directive, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { FormGroupSummary, FormGroupUpdate } from '../../types';
import { ControlChildren } from './control-children';

@Directive({
    selector: '[libFormGroup]',
})
export class FormGroupDirective extends ControlChildren implements AfterViewInit, OnDestroy {
    @Input('formSummary$')
    set setFormSummary$(formSummary$: Observable<FormGroupSummary>) {
        this.unsubscribe();
        this.subscriptions.push(formSummary$.subscribe(summary => this.updateSummary(summary)));
    }

    @Output() formUpdate = new EventEmitter<FormGroupUpdate>();

    subscriptions = new Array<Subscription>();

    ngAfterViewInit() {
        this.getChildren().forEach(control => {
            control.formUpdate.subscribe(update =>
                this.formUpdate.next({ controls: { [control.controlKey]: update } })
            );
        });
    }

    updateSummary(summary: FormGroupSummary) {
        const children = this.getChildren();
        if (!children.length) {
            return;
        }

        children.forEach(control => {
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
