import {
    ElementRef,
    EventEmitter,
    Inject,
    Input,
    OnDestroy,
    Output,
    Renderer2,
} from '@angular/core';
import { BehaviorSubject, merge, Observable, Subject, Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { FormControlSummary, FormControlUpdate, FormsConfig } from '../../types';
import { CONFIG_TOKEN, throttle } from './../../config';

const cssClasses = {
    invalid: 'ng-invalid',
    valid: 'ng-valid',
    pristine: 'ng-pristine',
    dirty: 'ng-dirty',
    touched: 'ng-touched',
    untouched: 'ng-untouched',
};

export const CONTROL_DIRECTIVE_SELECTOR = `ngrxFormControl`;

export abstract class AbstractControlDirective<T> implements OnDestroy {
    @Input(CONTROL_DIRECTIVE_SELECTOR)
    controlKey?: string;

    @Input('controlSummary')
    set setControlSummary(controlSummary: FormControlSummary<T>) {
        if (!controlSummary) {
            return;
        }

        this.updateSummary(controlSummary);
    }

    @Input('controlConfig')
    set setConfig(inputConfig: Partial<FormsConfig>) {
        const config = {
            ...this.injectedConfig,
            ...inputConfig,
        };

        this.config$.next(config);
    }

    @Output() controlUpdate = new EventEmitter<FormControlUpdate<T>>(true);

    constructor(
        protected ref: ElementRef,
        protected r2: Renderer2,
        @Inject(CONFIG_TOKEN) private injectedConfig: FormsConfig
    ) {
        this.config$
            .pipe(
                switchMap(config =>
                    merge(this.touched$.pipe(throttle(config)), this.value$.pipe(throttle(config)))
                )
            )
            .subscribe(value => this.controlUpdate.emit(value));
    }

    private touched$ = new Subject<FormControlUpdate<T>>();
    private value$ = new Subject<FormControlUpdate<T>>();
    protected config$ = new BehaviorSubject<FormsConfig>(this.injectedConfig);

    private summarySubscription = new Subscription();

    abstract setValue(value: T);

    setDisabled?(disabled: boolean);

    emitTouched() {
        this.touched$.next({ untouched: false });
    }

    emitValue(value: T) {
        this.value$.next({ value, pristine: false });
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
        this.summarySubscription.unsubscribe();
        this.config$.complete();
        this.touched$.complete();
        this.value$.complete();
    }
}
