import { initFormControl, initFormGroup } from './init';
import { FormControlState } from './types';

describe('init', () => {
    describe('initFormControl', () => {
        describe('initalizeTuple', () => {
            const value = 'value';

            it('["value"] should create a valid form control state', () => {
                const expected: FormControlState<string> = {
                    value,
                    disabled: false,
                    pristine: true,
                    untouched: true,
                    validators: [],
                };

                const result = initFormControl([value]);

                expect(result).toEqual(expected);
            });

            it('["value", [() => null]] should create a valid form control state with validator', () => {
                const validator = () => null;

                const expected: FormControlState<string> = {
                    value,
                    disabled: false,
                    pristine: true,
                    untouched: true,
                    validators: [validator],
                };

                const result = initFormControl([value, [validator]]);

                expect(result).toEqual(expected);
            });
        });

        describe('initialUpdate', () => {
            const value = 'value';

            it('{value: value} should create a valid form control state', () => {
                const expected: FormControlState<string> = {
                    value,
                    disabled: false,
                    pristine: true,
                    untouched: true,
                    validators: [],
                };

                const result = initFormControl({ value });

                expect(result).toEqual(expected);
            });

            it('["value", [() => null]] should create a valid form control state with validator', () => {
                const validator = () => null;

                const expected: FormControlState<string> = {
                    value,
                    disabled: false,
                    pristine: true,
                    untouched: true,
                    validators: [validator],
                };

                const result = initFormControl({ value, validators: [validator] });

                expect(result).toEqual(expected);
            });

            it('{value: value, disabled: true, pristine: false, untouched: false} should create a valid form control state', () => {
                const expected: FormControlState<string> = {
                    value,
                    disabled: true,
                    pristine: false,
                    untouched: false,
                    validators: [],
                };

                const result = initFormControl({
                    value,
                    disabled: expected.disabled,
                    pristine: expected.pristine,
                    untouched: expected.untouched,
                    validators: [],
                });

                expect(result).toEqual(expected);
            });
        });
    });
});
