import {
    Directive,
    ElementRef,
    Input,
    HostListener,
    EventEmitter,
    Output,
    OnChanges,
    OnDestroy,
    Renderer2,
} from '@angular/core';
import { FormControlSummary, FormControlUpdate } from './types';
import { Observable, Subscription } from 'rxjs';

const classes = {
    invalid: 'ng-invalid',
    valid: 'ng-valid',
    pristine: 'ng-pristine',
    dirty: 'ng-dirty',
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
        this.formUpdate.emit({ value: this.ref.nativeElement.value });
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
