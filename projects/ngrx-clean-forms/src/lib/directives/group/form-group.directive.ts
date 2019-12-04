import { AfterViewInit, Directive, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { Observable, Subscription, Subject } from 'rxjs';
import { FormGroupSummary, FormGroupUpdate } from '../../types';
import { ControlChildren } from './control-children';
import { takeUntil, first } from 'rxjs/operators';

@Directive({
    selector: '[ngrxForm]',
})
export class FormGroupDirective extends ControlChildren implements AfterViewInit, OnDestroy {
    @Input('formSummary$')
    set setFormSummary$(formSummary$: Observable<FormGroupSummary>) {
        this.destroy$.complete();

        this.formSummary$ = formSummary$;
        this.formSummary$
            .pipe(takeUntil(this.destroy$))
            .subscribe(summary => this.updateSummary(summary));
    }

    @Output() formUpdate = new EventEmitter<FormGroupUpdate>();

    formSummary$: Observable<FormGroupSummary>;
    destroy$ = new Subject<void>();

    ngAfterViewInit() {
        this.getChildren().forEach(control => {
            control.formUpdate.subscribe(update =>
                this.formUpdate.next({ controls: { [control.controlKey]: update } })
            );
        });

        this.formSummary$.pipe(first()).subscribe(summary => this.updateSummary(summary));
    }

    ngOnDestroy() {
        this.destroy$.complete();
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
}
