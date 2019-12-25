import { ElementRef, EventEmitter, Input, OnDestroy, Output, Renderer2 } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { FormControlSummary, FormControlUpdate } from '../../types';
import { takeUntil } from 'rxjs/operators';

const cssClasses = {
    invalid: 'ng-invalid',
    valid: 'ng-valid',
    pristine: 'ng-pristine',
    dirty: 'ng-dirty',
    touched: 'ng-touched',
    untouched: 'ng-untouched',
};

export const CONTROL_DIRECTIVE_SELECTOR = `ngrxControl`;

export abstract class AbstractControlDirective<T> implements OnDestroy {
    @Input(CONTROL_DIRECTIVE_SELECTOR)
    controlKey?: string;

    @Input('controlSummary$')
    set setControlSummary$(controlSummary$: Observable<FormControlSummary<T>>) {
        this.destroy$.complete();

        controlSummary$
            .pipe(takeUntil(this.destroy$))
            .subscribe(summary => this.updateSummary(summary));
    }

    @Output() controlUpdate = new EventEmitter<FormControlUpdate<T>>(true);

    private destroy$ = new Subject<void>();

    constructor(protected ref: ElementRef, protected r2: Renderer2) {}

    abstract setValue(value: T);

    setDisabled?(disabled: boolean);

    emitTouched() {
        this.controlUpdate.emit({ untouched: false });
    }

    emitValue(value: T) {
        this.controlUpdate.emit({ value, pristine: false });
    }

    updateSummary(summary: FormControlSummary<T>) {
        this.setValue(summary.value);
        this.setDisabled(summary.disabled);

        this.chooseClass(cssClasses.invalid, cssClasses.valid, summary.valid);
        this.chooseClass(cssClasses.dirty, cssClasses.pristine, summary.pristine);
        this.chooseClass(cssClasses.touched, cssClasses.untouched, summary.untouched);
    }

    chooseClass(class1: string, class2: string, chooseSecond: boolean) {
        if (chooseSecond) {
            this.r2.addClass(this.ref.nativeElement, class2);
            this.r2.removeClass(this.ref.nativeElement, class1);
        } else {
            this.r2.addClass(this.ref.nativeElement, class1);
            this.r2.removeClass(this.ref.nativeElement, class2);
        }
    }

    ngOnDestroy() {
        this.destroy$.complete();
    }
}
