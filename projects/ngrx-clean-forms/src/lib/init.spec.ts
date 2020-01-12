import { initFormControl, initFormGroup } from './init';
import { FormControlState, FormGroupState } from './types';

describe('init', () => {
    const validator = () => null;
    const value = 'value';

    describe('initFormControl', () => {
        describe('initalizeTuple', () => {
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

    describe('initFormGroup', () => {
        it('should create a valid form group (with initializeTuple & initUpdate)', () => {
            const expected: FormGroupState<{ tuple: string; update: string }> = {
                controls: {
                    tuple: {
                        disabled: false,
                        pristine: true,
                        untouched: true,
                        validators: [validator],
                        value,
                    },
                    update: {
                        disabled: true,
                        pristine: false,
                        untouched: false,
                        validators: [validator],
                        value,
                    },
                },
            };

            const result = initFormGroup({
                tuple: [value, [validator]],
                update: {
                    value,
                    validators: [validator],
                    disabled: true,
                    pristine: false,
                    untouched: false,
                },
            });

            expect(result).toEqual(expected);
        });
    });
});