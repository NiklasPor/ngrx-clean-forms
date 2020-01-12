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
            ngrxControl
            [controlSummary$]="summary$"
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
            imports: [NgrxCleanFormsModule],
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

        const result = testInputComponent.value;

        expect(result).toBe('5');
    });

    it('disabled update propagates to child (true)', () => {
        testComponent.componentInstance.summary$.next(
            getFormControlSummary(initFormControl({ value: '5', disabled: true }))
        );

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
});
