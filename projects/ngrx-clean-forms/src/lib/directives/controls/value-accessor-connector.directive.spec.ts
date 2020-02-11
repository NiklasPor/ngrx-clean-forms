import { Component, DebugElement, forwardRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ReplaySubject } from 'rxjs';
import { initFormControl } from '../../init';
import { NgrxCleanFormsModule } from '../../ngrx-clean-forms.module';
import { getFormControlSummary } from '../../selectors';
import { FormControlSummary, FormControlUpdate } from '../../types';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { ValueAccessorConnectorDirective } from './value-accessor-connector.directive';

@Component({
    selector: 'ngrx-test-component',
    template: `
        <ngrx-input-test
            ngrxFormControl
            [controlSummary]="summary$ | async"
            (controlUpdate)="update($event)"
        ></ngrx-input-test>
    `,
})
class TestComponent {
    summary$: ReplaySubject<FormControlSummary<string>>;
    update: () => {};
}

@Component({
    selector: 'ngrx-input-test',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => TestInputComponent),
            multi: true,
        },
    ],
    template: '',
})
class TestInputComponent implements ControlValueAccessor {
    disabled = false;
    value: string;

    onChange: (value) => void;
    onTouched: () => void;

    writeValue(value: string): void {
        this.value = value;
    }

    registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    setDisabledState?(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }
}

describe('ValueAccessorConnectorDirective', () => {
    let testComponent: ComponentFixture<TestComponent>;
    let testInputComponent: TestInputComponent;

    let directiveDebug: DebugElement;
    let directive: ValueAccessorConnectorDirective;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                NgrxCleanFormsModule.withConfig({
                    distinctWritesOnly: true,
                }),
            ],
            declarations: [TestComponent, TestInputComponent],
        });

        testComponent = TestBed.createComponent(TestComponent);
        testComponent.componentInstance.summary$ = new ReplaySubject(1);
        testComponent.componentInstance.update = () => ({});

        testInputComponent = testComponent.debugElement.query(By.directive(TestInputComponent))
            .componentInstance;

        testComponent.detectChanges();

        directiveDebug = testComponent.debugElement.query(
            By.directive(ValueAccessorConnectorDirective)
        );

        directive = directiveDebug.injector.get(ValueAccessorConnectorDirective);
    });

    it('value update propagates to child (5)', () => {
        testComponent.componentInstance.summary$.next(
            getFormControlSummary(initFormControl(['5']))
        );

        testComponent.detectChanges();

        const result = testInputComponent.value;

        expect(result).toBe('5');
    });

    it('disabled update propagates to child (true)', () => {
        testComponent.componentInstance.summary$.next(
            getFormControlSummary(initFormControl({ value: '5', disabled: true }))
        );

        testComponent.detectChanges();

        const result = testInputComponent.disabled;

        expect(result).toBe(true);
    });

    it('value update propagates from child', done => {
        const value = '5';

        const expected: FormControlUpdate<string> = {
            value,
            pristine: false,
        };

        directive.controlUpdate.subscribe(result => {
            expect(result).toEqual(expected);
            done();
        });

        testInputComponent.onChange(value);
    });

    it('touched update propagates from child', done => {
        const expected: FormControlUpdate<string> = {
            untouched: false,
        };

        directive.controlUpdate.subscribe(result => {
            expect(result).toEqual(expected);
            done();
        });

        testInputComponent.onTouched();
    });

    describe('distinctWritesOnly', () => {
        it('duplicate writes should only call once (distinctWritesOnly: true)', () => {
            const spy = spyOn(testInputComponent, 'writeValue');

            testComponent.componentInstance.summary$.next(
                getFormControlSummary(initFormControl({ value: '5' }))
            );
            testComponent.detectChanges();

            testComponent.componentInstance.summary$.next(
                getFormControlSummary(initFormControl({ value: '5' }))
            );
            testComponent.detectChanges();

            expect(spy).toHaveBeenCalledTimes(1);
        });

        it('different writes should each write', () => {
            const spy = spyOn(testInputComponent, 'writeValue');

            testComponent.componentInstance.summary$.next(
                getFormControlSummary(initFormControl({ value: '5' }))
            );
            testComponent.detectChanges();

            testComponent.componentInstance.summary$.next(
                getFormControlSummary(initFormControl({ value: '6' }))
            );
            testComponent.detectChanges();

            expect(spy).toHaveBeenCalledTimes(2);
        });

        it('duplicate writes with objects should only write once', () => {
            const spy = spyOn(testInputComponent, 'writeValue');

            const value: any = { someValue: 'value' };

            testComponent.componentInstance.summary$.next(
                getFormControlSummary(initFormControl({ value }))
            );
            testComponent.detectChanges();

            testComponent.componentInstance.summary$.next(
                getFormControlSummary(initFormControl({ value }))
            );
            testComponent.detectChanges();

            expect(spy).toHaveBeenCalledTimes(1);
        });

        it('duplicate writes with circular referencing objects should write once', () => {
            const value = 'value';

            function CircularExample(val) {
                this.me = {
                    deeply: {
                        nested: {
                            reference: this,
                        },
                    },
                    val,
                };
            }

            const spy = spyOn(testInputComponent, 'writeValue');

            testComponent.componentInstance.summary$.next(
                getFormControlSummary(initFormControl({ value: new CircularExample(value) }))
            );
            testComponent.detectChanges();

            testComponent.componentInstance.summary$.next(
                getFormControlSummary(initFormControl({ value: new CircularExample(value) }))
            );
            testComponent.detectChanges();

            expect(spy).toHaveBeenCalledTimes(1);
        });
    });
});
