import { AfterViewInit, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { combineLatest, merge, Observable, ReplaySubject, Subject } from 'rxjs';
import { map, switchMap, takeUntil } from 'rxjs/operators';
import {
    FormArraySummary,
    FormArrayUpdate,
    FormControlUpdate,
    FormGroupSummary,
    FormGroupUpdate,
} from '../../types';
import { AbstractControlDirective } from '../controls/abstract-control.directive';
import { ControlChildren } from './control-children';

type FormSummary = FormGroupSummary<any> | FormArraySummary<any>;
type FormUpdate = FormGroupUpdate<any> | FormArrayUpdate<any>;

export abstract class AbstractFormDirective<Summary extends FormSummary, Update extends FormUpdate>
    extends ControlChildren
    implements AfterViewInit, OnDestroy {
    @Input('formSummary')
    set setFormSummary(summary: Summary) {
        if (!summary) {
            return;
        }

        this.formSummary$.next(summary);
    }

    @Output() formUpdate = new EventEmitter<Update>();

    formSummary$ = new ReplaySubject<FormSummary>(1);

    ngAfterViewInit() {
        const children$ = this.getChildren();

        children$
            .pipe(
                map(children =>
                    children.map(child =>
                        child.controlUpdate.pipe(
                            map((update): [typeof update, string] => [update, child.controlKey])
                        )
                    )
                ),
                switchMap(children => merge(...children))
            )
            .subscribe(([update, key]) => this.emitUpdate(update, key));

        combineLatest(children$, this.formSummary$).subscribe(([children, summary]) =>
            this.updateChildren(children, summary)
        );
    }

    ngOnDestroy() {
        this.formSummary$.complete();
    }

    updateChildren(children: AbstractControlDirective<any>[], summary: FormSummary) {
        if (!children.length) {
            return;
        }

        children.forEach(control => {
            control.updateSummary(summary.controls[control.controlKey]);
        });
    }

    abstract emitUpdate(update: FormControlUpdate<any>, key: string);
}
