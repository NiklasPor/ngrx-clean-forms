import {
    AfterViewInit,
    EventEmitter,
    Input,
    OnDestroy,
    Output,
    Directive,
    ChangeDetectorRef,
} from '@angular/core';
import { combineLatest, merge, Observable, ReplaySubject, Subject } from 'rxjs';
import { map, switchMap, takeUntil, first } from 'rxjs/operators';
import {
    FormArraySummary,
    FormArrayUpdate,
    FormControlUpdate,
    FormGroupSummary,
    FormGroupUpdate,
} from '../../types';
import { AbstractControlDirective } from '../controls/abstract-control.directive';
import { ControlChildren } from './control-children';

const UnkownControlError = (controlKey) =>
    new Error(`The control "${controlKey}" is not part of the form.`);

type FormSummary = FormGroupSummary<any> | FormArraySummary<any>;
type FormUpdate = FormGroupUpdate<any> | FormArrayUpdate<any>;

@Directive()
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

    constructor(private cdr: ChangeDetectorRef) {
        super();
    }

    formSummary$ = new ReplaySubject<FormSummary>(1);

    ngAfterViewInit() {
        const children$ = this.getChildren();

        children$
            .pipe(
                map((children) =>
                    children.map((child) =>
                        child.controlUpdate.pipe(
                            map((update): [typeof update, string] => [update, child.controlKey])
                        )
                    )
                ),
                switchMap((children) => merge(...children))
            )
            .subscribe(([update, key]) => this.emitUpdate(update, key));

        combineLatest([children$, this.formSummary$]).subscribe(([children, summary]) =>
            this.updateChildren(children, summary)
        );
    }

    ngOnDestroy() {
        this.formSummary$.complete();
    }

    async updateChildren(
        children: AbstractControlDirective<any>[],
        summary: FormSummary,
        shouldRetry = true
    ) {
        const safeChildren = children.filter(Boolean);

        const unknownControl = safeChildren.find(
            (child) => summary.controls[child.controlKey] === undefined
        );

        if (unknownControl && !shouldRetry) {
            throw UnkownControlError(unknownControl.controlKey);
        }

        if (unknownControl) {
            this.cdr.detectChanges();
            const updatedChildren = await this.getChildren().pipe(first()).toPromise();
            return this.updateChildren(updatedChildren, summary, false);
        }

        safeChildren.forEach((control) => {
            control.updateSummary(summary.controls[control.controlKey]);
        });
    }

    abstract emitUpdate(update: FormControlUpdate<any>, key: string);
}
