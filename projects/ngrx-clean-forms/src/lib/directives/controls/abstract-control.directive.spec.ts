import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ReplaySubject } from 'rxjs';
import { initFormControl } from '../../init';
import { NgrxCleanFormsModule } from '../../ngrx-clean-forms.module';
import { getFormControlSummary } from '../../selectors';
import { FormControlSummary, FormsConfig } from '../../types';
import { TextInputControlDirective } from './text-input-control.directive';

@Component({
    selector: 'ngrx-test-component',
    template: `
        <input
            ngrxFormControl
            type="text"
            [controlSummary$]="summary$"
            (controlUpdate)="update($event)"
        />
    `,
})
class TestComponent {
    summary$: ReplaySubject<FormControlSummary<string>>;
    update: () => {};
}

describe('TextInputControlDirective', () => {
    const moduleFormsConfig: FormsConfig = {
        distinctWritesOnly: true,
        throttleTime: 111111111111,
    };

    let testComponent: ComponentFixture<TestComponent>;

    let directiveDebug: DebugElement;
    let directive: TextInputControlDirective;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [NgrxCleanFormsModule.withConfig(moduleFormsConfig)],
            declarations: [TestComponent],
        });

        testComponent = TestBed.createComponent(TestComponent);
        testComponent.componentInstance.summary$ = new ReplaySubject(1);
        testComponent.componentInstance.update = () => ({});

        testComponent.detectChanges();

        directiveDebug = testComponent.debugElement.query(By.directive(TextInputControlDirective));

        directive = directiveDebug.injector.get(TextInputControlDirective);
    });

    describe('cssClasses', () => {
        it('{pristine: true} sets ng-pristine and unsets ng-dirty', () => {
            testComponent.componentInstance.summary$.next({
                ...getFormControlSummary(initFormControl([''])),
                pristine: true,
            });

            // tslint:disable-next-line: no-string-literal
            const isPristine = directive['ref'].nativeElement.classList.contains('ng-pristine');
            // tslint:disable-next-line: no-string-literal
            const isDirty = directive['ref'].nativeElement.classList.contains('ng-dirty');

            expect(isPristine).toBe(true);
            expect(isDirty).toBe(false);
        });

        it('{pristine: false} sets ng-dirty and unsets ng-pristine', () => {
            testComponent.componentInstance.summary$.next({
                ...getFormControlSummary(initFormControl([''])),
                pristine: false,
            });

            // tslint:disable-next-line: no-string-literal
            const isPristine = directive['ref'].nativeElement.classList.contains('ng-pristine');
            // tslint:disable-next-line: no-string-literal
            const isDirty = directive['ref'].nativeElement.classList.contains('ng-dirty');

            expect(isPristine).toBe(false);
            expect(isDirty).toBe(true);
        });

        it('{valid: true} sets ng-valid and unsets ng-invalid', () => {
            testComponent.componentInstance.summary$.next({
                ...getFormControlSummary(initFormControl([''])),
                valid: true,
            });

            // tslint:disable-next-line: no-string-literal
            const isValid = directive['ref'].nativeElement.classList.contains('ng-valid');
            // tslint:disable-next-line: no-string-literal
            const isInvalid = directive['ref'].nativeElement.classList.contains('ng-invalid');

            expect(isValid).toBe(true);
            expect(isInvalid).toBe(false);
        });

        it('{valid: false} sets ng-invalid and unsets ng-valid', () => {
            testComponent.componentInstance.summary$.next({
                ...getFormControlSummary(initFormControl([''])),
                valid: false,
            });

            // tslint:disable-next-line: no-string-literal
            const isValid = directive['ref'].nativeElement.classList.contains('ng-valid');
            // tslint:disable-next-line: no-string-literal
            const isInvalid = directive['ref'].nativeElement.classList.contains('ng-invalid');

            expect(isValid).toBe(false);
            expect(isInvalid).toBe(true);
        });

        it('{untouched: true} sets ng-untouched and unsets ng-touched', () => {
            testComponent.componentInstance.summary$.next({
                ...getFormControlSummary(initFormControl([''])),
                untouched: true,
            });

            // tslint:disable-next-line: no-string-literal
            const isUntouched = directive['ref'].nativeElement.classList.contains('ng-untouched');
            // tslint:disable-next-line: no-string-literal
            const isTouched = directive['ref'].nativeElement.classList.contains('ng-touched');

            expect(isUntouched).toBe(true);
            expect(isTouched).toBe(false);
        });

        it('{untouched: false} sets ng-touched and unsets ng-untouched', () => {
            testComponent.componentInstance.summary$.next({
                ...getFormControlSummary(initFormControl([''])),
                untouched: false,
            });

            // tslint:disable-next-line: no-string-literal
            const isUntouched = directive['ref'].nativeElement.classList.contains('ng-untouched');
            // tslint:disable-next-line: no-string-literal
            const isTouched = directive['ref'].nativeElement.classList.contains('ng-touched');

            expect(isUntouched).toBe(false);
            expect(isTouched).toBe(true);
        });
    });

    describe('config', () => {
        it('subject should have the default module config', () => {
            // tslint:disable-next-line
            const config$ = directive['config$'];
            expect(config$.value).toEqual(moduleFormsConfig);
        });

        it('setConfig should override module config', () => {
            const config: FormsConfig = {
                distinctWritesOnly: false,
                throttleTime: 2222222,
            };

            directive.setConfig = config;

            // tslint:disable-next-line
            const config$ = directive['config$'];
            expect(config$.value).toEqual(config);
        });
    });
});
