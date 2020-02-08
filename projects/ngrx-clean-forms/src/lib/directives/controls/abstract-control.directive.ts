import {
    ElementRef,
    EventEmitter,
    Input,
    OnDestroy,
    Output,
    Renderer2,
    Inject,
} from '@angular/core';
import { Observable, Subject, ReplaySubject, merge, asyncScheduler, Subscription } from 'rxjs';
import { FormControlSummary, FormControlUpdate, FormsConfig } from '../../types';
import {
    takeUntil,
    share,
    debounceTime,
    auditTime,
    throttleTime,
    tap,
    distinctUntilChanged,
} from 'rxjs/operators';
import { CONFIG_TOKEN } from '../../ngrx-clean-forms.module';

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
    @Input('controlSummary$')
    set setControlSummary$(controlSummary$: Observable<FormControlSummary<T>>) {
        this.summarySubscription.unsubscribe();
        this.summarySubscription = controlSummary$.subscribe(summary =>
            this.updateSummary(summary)
        );
    }

    @Input('config')
    set setConfig(inputConfig: Partial<FormsConfig>) {
        const config = {
            ...this.injectedConfig,
            ...inputConfig,
        };

        this.updateSubscription.unsubscribe();
        this.updateSubscription = merge(
            this.touched$.pipe(
                this.touchedDistinct(config.distinctOnly),
                this.throttle(config.throttleTime)
            ),
            this.value$.pipe(
                this.valueDistinct(config.distinctOnly),
                this.throttle(config.throttleTime)
            )
        ).subscribe(value => this.controlUpdate.emit(value));
    }

    constructor(
        protected ref: ElementRef,
        protected r2: Renderer2,
        @Inject(CONFIG_TOKEN) private injectedConfig: FormsConfig
    ) {
        this.setConfig = {};
    }
    private touched$ = new Subject<FormControlUpdate<T>>();
    private value$ = new Subject<FormControlUpdate<T>>();

    private summarySubscription = new Subscription();
    private updateSubscription = new Subscription();

    @Input(CONTROL_DIRECTIVE_SELECTOR)
    controlKey?: string;

    @Output() controlUpdate = new EventEmitter<FormControlUpdate<T>>();

    private readonly touchedDistinct = (enable: boolean) =>
        distinctUntilChanged<{ untouched: boolean }>(
            (first, second) => !enable || first.untouched === second.untouched
        );

    private readonly valueDistinct = (enable: boolean) =>
        distinctUntilChanged<{ value: T; pristine: false }>(
            (first, second) =>
                !enable || (first.value === second.value && first.pristine === second.pristine)
        );

    private readonly throttle = (time: number) =>
        throttleTime(time, asyncScheduler, {
            leading: true,
            trailing: true,
        });

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
        this.updateSubscription.unsubscribe();
    }
}
