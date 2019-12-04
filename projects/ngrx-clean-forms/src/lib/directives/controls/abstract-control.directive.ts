import {
    ElementRef,
    EventEmitter,
    Input,
    OnDestroy,
    Output,
    Renderer2,
    Directive,
} from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { FormControlSummary, FormControlUpdate } from '../../types';

const classes = {
    invalid: 'ng-invalid',
    valid: 'ng-valid',
    pristine: 'ng-pristine',
    dirty: 'ng-dirty',
    touched: 'ng-touched',
    untouched: 'ng-untouched',
};

export abstract class AbstractControlDirective<T> implements OnDestroy {
    @Input()
    controlKey: string;

    @Input('formSummary$')
    set setFormSummary$(formSummary$: Observable<FormControlSummary<T>>) {
        this.unsubscribe();
        this.subscription = formSummary$.subscribe(summary => this.updateSummary(summary));
    }

    @Output() formUpdate = new EventEmitter<FormControlUpdate<T>>(true);

    subscription: Subscription;

    constructor(protected ref: ElementRef, private r2: Renderer2) {}

    abstract setValue(value: T);

    emitTouched() {
        this.formUpdate.emit({ untouched: false });
    }

    emitValue(value: T) {
        console.log(value);
        this.formUpdate.emit({ value, pristine: false });
    }

    updateSummary(summary: FormControlSummary<T>) {
        this.setValue(summary.value);

        if (summary.valid) {
            this.r2.addClass(this.ref.nativeElement, classes.valid);
            this.r2.removeClass(this.ref.nativeElement, classes.invalid);
        } else {
            this.r2.addClass(this.ref.nativeElement, classes.invalid);
            this.r2.removeClass(this.ref.nativeElement, classes.valid);
        }

        if (summary.pristine) {
            this.r2.addClass(this.ref.nativeElement, classes.pristine);
            this.r2.removeClass(this.ref.nativeElement, classes.dirty);
        } else {
            this.r2.addClass(this.ref.nativeElement, classes.dirty);
            this.r2.removeClass(this.ref.nativeElement, classes.pristine);
        }

        if (summary.untouched) {
            this.r2.addClass(this.ref.nativeElement, classes.untouched);
            this.r2.removeClass(this.ref.nativeElement, classes.touched);
        } else {
            this.r2.addClass(this.ref.nativeElement, classes.touched);
            this.r2.removeClass(this.ref.nativeElement, classes.untouched);
        }
    }

    ngOnDestroy() {
        this.unsubscribe();
    }

    unsubscribe() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
}
