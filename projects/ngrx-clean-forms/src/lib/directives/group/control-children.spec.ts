import { Component, Directive, forwardRef } from '@angular/core';
import { async, TestBed } from '@angular/core/testing';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { first } from 'rxjs/operators';
import { NgrxCleanFormsModule } from '../../ngrx-clean-forms.module';
import { CheckboxInputControlDirective } from '../controls/checkbox-input-control.directive';
import { NumberInputControlDirective } from '../controls/number-input-control.directive';
import { RangeInputControlDirective } from '../controls/range-input-control.directive';
import { SelectControlNotSupported } from '../controls/select-input-control.directive';
import { TextInputControlDirective } from '../controls/text-input-control.directive';
import { RadioControlNotSupported } from './../controls/radio-input-control.directive';
import { ValueAccessorConnectorDirective } from './../controls/value-accessor-connector.directive';
import { ControlChildren } from './control-children';

@Component({
    template: '',
    selector: 'ngrx-custom-input',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => CustomInputComponent),
            multi: true,
        },
    ],
})
class CustomInputComponent implements ControlValueAccessor {
    writeValue(obj: any): void {}
    registerOnChange(fn: any): void {}
    registerOnTouched(fn: any): void {}
    setDisabledState?(isDisabled: boolean): void {}
}

describe('control-children', () => {
    beforeEach(async(async () => {}));

    it(`should support checkboxInput`, async () => {
        const childDirectives = await getChildDirectivesForComponent(`
            <input type="checkbox" ngrxControl/>
        `);

        expect(childDirectives.find(d => d instanceof CheckboxInputControlDirective)).toBeDefined();
    });

    it(`should support numberInput`, async () => {
        const childDirectives = await getChildDirectivesForComponent(`
            <input type="number" ngrxControl />
        `);

        expect(childDirectives.find(d => d instanceof NumberInputControlDirective)).toBeDefined();
    });

    it(`should throw RadioControlNotSupported on radioInput`, async () => {
        let error;

        try {
            const childDirectives = await getChildDirectivesForComponent(`
                <input type="radio" ngrxControl />
            `);
        } catch (e) {
            error = e;
        }

        expect(error).toBe(RadioControlNotSupported);
    });

    it(`should support rangeInput`, async () => {
        const childDirectives = await getChildDirectivesForComponent(`
            <input type="range" ngrxControl />
        `);

        expect(childDirectives.find(d => d instanceof RangeInputControlDirective)).toBeDefined();
    });

    it(`should throw SelectControlNotSupported on selectInput`, async () => {
        let error;

        try {
            const childDirectives = await getChildDirectivesForComponent(`
                <select ngrxControl>
                </select>
            `);
        } catch (e) {
            error = e;
        }

        expect(error).toBe(SelectControlNotSupported);
    });

    it(`should support textInput`, async () => {
        const childDirectives = await getChildDirectivesForComponent(`
            <input type="text" ngrxControl />
        `);

        expect(childDirectives.find(d => d instanceof TextInputControlDirective)).toBeDefined();
    });

    it(`should support default input`, async () => {
        const childDirectives = await getChildDirectivesForComponent(`
            <input ngrxControl />
        `);

        expect(childDirectives.find(d => d instanceof TextInputControlDirective)).toBeDefined();
    });

    it(`should support valueAccessor`, async () => {
        const childDirectives = await getChildDirectivesForComponent(`
            <ngrx-custom-input  ngrxControl>
            </ngrx-custom-input>
        `);

        expect(
            childDirectives.find(d => d instanceof ValueAccessorConnectorDirective)
        ).toBeDefined();
    });
});

async function getChildDirectivesForComponent(childTemplate: string) {
    @Directive({ selector: '[ngrxTestDirective]' })
    class TestDirective extends ControlChildren {
        testGetChildren = () => this.getChildren();
    }

    @Component({
        providers: [TestDirective],
        template: `
            <div ngrxTestDirective>
                ${childTemplate}
            </div>
        `,
    })
    class TestComponent {}

    await TestBed.configureTestingModule({
        imports: [NgrxCleanFormsModule],
        declarations: [TestDirective, TestComponent, CustomInputComponent],
    }).compileComponents();

    const component = TestBed.createComponent(TestComponent);
    component.detectChanges();

    const directive: TestDirective = component.debugElement
        .query(By.directive(TestDirective))
        .injector.get(TestDirective);

    const children = await directive
        .testGetChildren()
        .pipe(first())
        .toPromise();

    return children;
}
