import {
    Directive,
    ElementRef,
    EventEmitter,
    HostListener,
    Input,
    OnDestroy,
    Output,
    Renderer2,
} from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { FormControlSummary, FormControlUpdate } from './types';

const classes = {
    invalid: 'ng-invalid',
    valid: 'ng-valid',
    pristine: 'ng-pristine',
    dirty: 'ng-dirty',
    touched: 'ng-touched',
    untouched: 'ng-untouched',
};

@Directive({
    selector: '[libSingleControl]',
})
export class SingleControlDirective implements OnDestroy {
    @Input('formSummary$')
    set setFormSummary$(formSummary$: Observable<FormControlSummary<any>>) {
        this.unsubscribe();
        formSummary$.subscribe(summary => this.updateInput(summary));
    }

    @Output() formUpdate = new EventEmitter<FormControlUpdate<any>>();

    subscription: Subscription;

    constructor(private ref: ElementRef, private r2: Renderer2) {}

    @HostListener('input') onInput() {
        this.formUpdate.emit({ pristine: false });
        this.formUpdate.emit({ value: this.ref.nativeElement.value });
    }

    @HostListener('blur') onBlur() {
        this.formUpdate.emit({ touched: true });
    }

    updateInput(summary: FormControlSummary<any>) {
        this.ref.nativeElement.value = summary.value;

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

        if (summary.touched) {
            this.r2.addClass(this.ref.nativeElement, classes.touched);
            this.r2.removeClass(this.ref.nativeElement, classes.untouched);
        } else {
            this.r2.addClass(this.ref.nativeElement, classes.untouched);
            this.r2.removeClass(this.ref.nativeElement, classes.touched);
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
