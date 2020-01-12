import { Component, DebugElement } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { FormControlSummary, FormControlUpdate } from '../../types';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { NgrxCleanFormsModule } from '../../ngrx-clean-forms.module';
import { CheckboxInputControlDirective } from './checkbox-input-control.directive';
import { By } from '@angular/platform-browser';
import { initFormControl } from '../../init';
import { getFormControlSummary } from '../../selectors';
import { take } from 'rxjs/operators';

@Component({
    selector: 'ngrx-test-component',
    template: `
        <input
            ngrxControl
            type="checkbox"
            [controlSummary$]="summary$"
            (controlUpdate)="update($event)"
        />
    `,
})
class TestComponent {
    summary$: ReplaySubject<FormControlSummary<boolean>>;
    update: () => {};
}

describe('checkboxInputControlDirective', () => {
    let testComponent: ComponentFixture<TestComponent>;

    let directiveDebug: DebugElement;
    let directive: CheckboxInputControlDirective;

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
            By.directive(CheckboxInputControlDirective)
        );

        directive = directiveDebug.injector.get(CheckboxInputControlDirective);
    });
    it('value update propagates to child (true)', () => {
        testComponent.componentInstance.summary$.next(
            getFormControlSummary(initFormControl([true]))
        );

        // tslint:disable-next-line: no-string-literal
        const result = directive['ref'].nativeElement.checked;

        expect(result).toBe(true);
    });

    it('value update propagates to child (false)', () => {
        testComponent.componentInstance.summary$.next(
            getFormControlSummary(initFormControl([false]))
        );

        // tslint:disable-next-line: no-string-literal
        const result = directive['ref'].nativeElement.checked;

        expect(result).toBe(false);
    });

    it('disabled update propagates to child (true)', () => {
        testComponent.componentInstance.summary$.next(
            getFormControlSummary(initFormControl({ value: true, disabled: true }))
        );

        // tslint:disable-next-line: no-string-literal
        const result = directive['ref'].nativeElement.disabled;

        expect(result).toBe(true);
    });

    it('disabled update propagates to child (false)', () => {
        testComponent.componentInstance.summary$.next(
            getFormControlSummary(initFormControl({ value: true, disabled: false }))
        );

        // tslint:disable-next-line: no-string-literal
        const result = directive['ref'].nativeElement.disabled;

        expect(result).toBe(false);
    });

    it('value update propagates from child', done => {
        const value = true;

        const expected: FormControlUpdate<boolean> = {
            value,
            pristine: false,
        };

        directive.controlUpdate.subscribe(result => {
            expect(result).toEqual(expected);
            done();
        });

        directive.onInput({
            target: {
                checked: value,
            },
        } as any);
    });

    it('touched update propagates from child', done => {
        const expected: FormControlUpdate<boolean> = {
            untouched: false,
        };

        directive.controlUpdate.subscribe(result => {
            expect(result).toEqual(expected);
            done();
        });

        directive.emitTouched();
    });
});
