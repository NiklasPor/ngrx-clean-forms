import { defaultConfig } from './../../config';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ReplaySubject, of } from 'rxjs';
import { first, take } from 'rxjs/operators';
import { initFormGroup } from '../../init';
import { NgrxCleanFormsModule } from '../../ngrx-clean-forms.module';
import { getFormGroupSummary } from '../../selectors';
import { FormGroupSummary } from '../../types';
import { TextInputControlDirective } from '../controls/text-input-control.directive';
import { FormGroupUpdate } from './../../types';
import { FormGroupDirective } from './form-group.directive';
import { UnkownControlError } from './abstract-form.directive';

@Component({
    template: `
        <div ngrxFormGroup [formSummary]="formSummary$ | async" (formUpdate)="update($event)">
            <input *ngIf="showInput" ngrxFormControl="control" />
        </div>
    `,
})
class TestComponent {
    formSummary$: ReplaySubject<FormGroupSummary<{ control: string }>>;
    update: (update) => void;
    showInput = true;
}

describe('FormGroupDirective', () => {
    let directive: FormGroupDirective;
    let textInputDirective: TextInputControlDirective;
    let testComponent: ComponentFixture<TestComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [NgrxCleanFormsModule],
            declarations: [TestComponent],
        });

        testComponent = TestBed.createComponent(TestComponent);
        testComponent.componentInstance.formSummary$ = new ReplaySubject(1, undefined);
        testComponent.componentInstance.update = () => {};

        testComponent.detectChanges();

        directive = testComponent.debugElement
            .query(By.directive(FormGroupDirective))
            .injector.get(FormGroupDirective);

        textInputDirective = testComponent.debugElement
            .query(By.directive(TextInputControlDirective))
            .injector.get(TextInputControlDirective);
    });

    it('should create an instance', () => {
        expect(directive).toBeTruthy();
    });

    it('should not crash on undefined child', () => {
        testComponent.componentInstance.showInput = false;
        testComponent.detectChanges();

        const summary = (value) => getFormGroupSummary(initFormGroup({ control: [value] }));

        testComponent.componentInstance.formSummary$.next(summary(''));

        expect(() => {
            directive.updateChildren([undefined], summary('test'));
        }).not.toThrowError();
    });

    it('should trigger change detection on unkown key child', () => {
        testComponent.componentInstance.showInput = false;
        testComponent.detectChanges();

        const summary = (value) => getFormGroupSummary(initFormGroup({ control: [value] }));

        testComponent.componentInstance.formSummary$.next(summary(''));

        const childDir = new TextInputControlDirective(undefined, undefined, defaultConfig);
        childDir.controlKey = 'unkownKey';

        // tslint:disable-next-line: no-string-literal
        const spy = spyOn(directive['cdr'], 'detectChanges');

        expectAsync(directive.updateChildren([childDir], summary('test'))).toBeResolved();

        expect(spy).toHaveBeenCalledTimes(1);
    });

    it('should trigger change detection on unkown key child', () => {
        testComponent.componentInstance.showInput = false;
        testComponent.detectChanges();

        const summary = (value) => getFormGroupSummary(initFormGroup({ control: [value] }));

        testComponent.componentInstance.formSummary$.next(summary(''));

        const childDir = new TextInputControlDirective(undefined, undefined, defaultConfig);
        childDir.controlKey = 'unkownKey';

        // tslint:disable-next-line: no-string-literal
        const spy = spyOn(directive['cdr'], 'detectChanges');

        // tslint:disable-next-line: no-string-literal
        directive['getChildren'] = () => of([childDir]);

        expectAsync(directive.updateChildren([childDir], summary('test'))).toBeRejectedWith(
            UnkownControlError(childDir.controlKey)
        );

        expect(spy).toHaveBeenCalledTimes(1);
    });

    it('should not crash without children', () => {
        expect(async () => {
            testComponent.componentInstance.showInput = false;
            testComponent.detectChanges();

            testComponent.componentInstance.formSummary$.next(
                getFormGroupSummary(initFormGroup({ control: [''] }))
            );

            // tslint:disable-next-line: no-string-literal
            const children = await directive['getChildren']().pipe(first()).toPromise();

            expect(children.length).toBe(0);
        }).not.toThrow();
    });

    it('should propagate update to child', () => {
        const value = 'value';
        const spy = spyOn(textInputDirective, 'setValue');

        testComponent.componentInstance.formSummary$.next(
            getFormGroupSummary(initFormGroup({ control: [value] }))
        );

        testComponent.detectChanges();

        expect(spy).toHaveBeenCalledWith(value);
    });

    it('should propagate child event', async () => {
        const value = 'value';

        textInputDirective.emitValue(value);

        const update = await directive.formUpdate.pipe(take(1)).toPromise();

        expect(update).toEqual({
            controls: {
                control: {
                    value,
                    pristine: false,
                },
            },
        } as FormGroupUpdate<{ control: string }>);
    });
});
