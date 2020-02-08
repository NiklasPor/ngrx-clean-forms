import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ReplaySubject } from 'rxjs';
import { initFormControl } from '../../init';
import { NgrxCleanFormsModule } from '../../ngrx-clean-forms.module';
import { getFormControlSummary } from '../../selectors';
import { FormControlSummary, FormControlUpdate } from '../../types';
import { NumberInputControlDirective } from './number-input-control.directive';

@Component({
    selector: 'ngrx-test-component',
    template: `
        <input
            ngrxFormControl
            type="number"
            [controlSummary$]="summary$"
            (controlUpdate)="update($event)"
        />
    `,
})
class TestComponent {
    summary$: ReplaySubject<FormControlSummary<number>>;
    update: () => {};
}

describe('numberInputControlDirective', () => {
    let testComponent: ComponentFixture<TestComponent>;

    let directiveDebug: DebugElement;
    let directive: NumberInputControlDirective;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [NgrxCleanFormsModule],
            declarations: [TestComponent],
        });

        testComponent = TestBed.createComponent(TestComponent);
        testComponent.componentInstance.summary$ = new ReplaySubject(1);
        testComponent.componentInstance.update = () => ({});

        testComponent.detectChanges();

        directiveDebug = testComponent.debugElement.query(
            By.directive(NumberInputControlDirective)
        );

        directive = directiveDebug.injector.get(NumberInputControlDirective);
    });

    it('value update propagates to child (5)', () => {
        testComponent.componentInstance.summary$.next(getFormControlSummary(initFormControl([5])));

        // tslint:disable-next-line: no-string-literal
        const result = directive['ref'].nativeElement.value;

        expect(result).toBe('5');
    });

    it('null value update propagates to child as empty string', () => {
        testComponent.componentInstance.summary$.next(
            getFormControlSummary(initFormControl([null]))
        );

        // tslint:disable-next-line: no-string-literal
        const result = directive['ref'].nativeElement.value;

        expect(result).toBe('');
    });

    it('disabled update propagates to child (true)', () => {
        testComponent.componentInstance.summary$.next(
            getFormControlSummary(initFormControl({ value: 5, disabled: true }))
        );

        // tslint:disable-next-line: no-string-literal
        const result = directive['ref'].nativeElement.disabled;

        expect(result).toBe(true);
    });

    it('disabled update propagates to child (false)', () => {
        testComponent.componentInstance.summary$.next(
            getFormControlSummary(initFormControl({ value: 5, disabled: false }))
        );

        // tslint:disable-next-line: no-string-literal
        const result = directive['ref'].nativeElement.disabled;

        expect(result).toBe(false);
    });

    it('value update propagates from child', done => {
        const value = 5;

        const expected: FormControlUpdate<number> = {
            value,
            pristine: false,
        };

        directive.controlUpdate.subscribe(result => {
            expect(result).toEqual(expected);
            done();
        });

        directive.onInput({
            target: {
                value,
            },
        } as any);
    });

    it('empty value update propagates from child as null', done => {
        const value = '';

        const expected: FormControlUpdate<number> = {
            value: null,
            pristine: false,
        };

        directive.controlUpdate.subscribe(result => {
            expect(result).toEqual(expected);
            done();
        });

        directive.onInput({
            target: {
                value,
            },
        } as any);
    });

    it('touched update propagates from child', done => {
        const expected: FormControlUpdate<number> = {
            untouched: false,
        };

        directive.controlUpdate.subscribe(result => {
            expect(result).toEqual(expected);
            done();
        });

        directive.onBlur();
    });
});
