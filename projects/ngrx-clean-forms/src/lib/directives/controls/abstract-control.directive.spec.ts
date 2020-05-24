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
            [controlSummary]="summary$ | async"
            (controlUpdate)="update($event)"
        />
    `,
})
class TestComponent {
    summary$: ReplaySubject<FormControlSummary<string>>;
    update: () => {};
}

describe('AbstractControlDirective', () => {
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
        [
            [{ pristine: true }, 'ng-pristine', 'ng-dirty'],
            [{ pristine: false }, 'ng-dirty', 'ng-pristine'],
            [{ valid: true }, 'ng-valid', 'ng-invalid'],
            [{ valid: false }, 'ng-invalid', 'ng-valid'],
            [{ untouched: true }, 'ng-untouched', 'ng-touched'],
            [{ untouched: false }, 'ng-touched', 'ng-untouched'],
            [{ changed: true }, 'ng-changed', 'ng-initial'],
            [{ changed: false }, 'ng-initial', 'ng-changed'],
        ].forEach(([update, shouldSet, shouldUnset]) => {
            it(`${update} should set ${shouldSet} and unset ${shouldUnset}`, () => {
                testComponent.componentInstance.summary$.next({
                    ...getFormControlSummary(initFormControl([''])),
                    ...(update as Partial<FormControlSummary<any>>),
                });

                testComponent.detectChanges();

                // tslint:disable-next-line: no-string-literal
                const isPristine = directive['ref'].nativeElement.classList.contains(shouldSet);
                // tslint:disable-next-line: no-string-literal
                const isDirty = directive['ref'].nativeElement.classList.contains(shouldUnset);

                expect(isPristine).toBe(true);
                expect(isDirty).toBe(false);
            });
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

    describe('updateSummary', () => {
        const value = 'value';
        let spy: jasmine.Spy;

        beforeEach(() => {
            spy = spyOn(directive, 'setValue');
        });

        it('should always write when distinct check is disabled & value is circular-equal', () => {
            directive.getValue = () => value;

            directive.setConfig = { distinctWritesOnly: false };
            directive.updateSummary(getFormControlSummary(initFormControl([value])));

            expect(spy).toHaveBeenCalledWith(value);
        });

        it('should always write when distinct check is disabled & value differs', () => {
            directive.getValue = () => value;

            directive.setConfig = { distinctWritesOnly: false };
            directive.updateSummary(getFormControlSummary(initFormControl([value])));

            expect(spy).toHaveBeenCalledWith(value);
        });

        it('should always write when distinct check is enabled & value differs', () => {
            directive.getValue = () => 'other value';

            directive.setConfig = { distinctWritesOnly: true };
            directive.updateSummary(getFormControlSummary(initFormControl([value])));

            expect(spy).toHaveBeenCalledWith(value);
        });

        it('should never write when distinct check is enabled & value is circular-equal', () => {
            directive.getValue = () => value;

            directive.setConfig = { distinctWritesOnly: true };
            directive.updateSummary(getFormControlSummary(initFormControl([value])));

            expect(spy).toHaveBeenCalledTimes(0);
        });
    });
});
