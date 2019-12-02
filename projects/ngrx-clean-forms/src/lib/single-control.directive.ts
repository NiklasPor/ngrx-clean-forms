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
    @Input()
    controlKey: string;

    @Input('formSummary$')
    set setFormSummary$(formSummary$: Observable<FormControlSummary<any>>) {
        this.unsubscribe();
        this.subscription = formSummary$.subscribe(summary => this.updateSummary(summary));
    }

    @Output() formUpdate = new EventEmitter<FormControlUpdate<any>>();

    subscription: Subscription;

    constructor(private ref: ElementRef, private r2: Renderer2) {}

    @HostListener('input') onInput() {
        this.formUpdate.emit({ value: this.ref.nativeElement.value, pristine: false });
    }

    @HostListener('blur') onBlur() {
        this.formUpdate.emit({ untouched: false });
    }

    updateSummary(summary: FormControlSummary<any>) {
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
