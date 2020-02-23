import { initFormArray, initFormControl, initFormGroup } from './init';
import { FormArrayState, FormControlState, FormGroupState } from './types';

describe('init', () => {
    const validator = () => null;
    const value = 'value';

    describe('initFormControl', () => {
        describe('initalizeTuple', () => {
            it('["value"] should create a valid form control state', () => {
                const expected: FormControlState<string> = {
                    value,
                    initialValue: value,
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
                    initialValue: value,
                    disabled: false,
                    pristine: true,
                    untouched: true,
                    validators: [validator],
                };

                const result = initFormControl([value, [validator]]);

                expect(result).toEqual(expected);
            });

            it('["value", undefined, true] should create a valid form control state which is disabled', () => {
                const expected: FormControlState<string> = {
                    value,
                    initialValue: value,
                    disabled: true,
                    pristine: true,
                    untouched: true,
                    validators: [],
                };

                const result = initFormControl([value, undefined, true]);

                expect(result).toEqual(expected);
            });
        });

        describe('initialUpdate', () => {
            it('{value: value} should create a valid form control state', () => {
                const expected: FormControlState<string> = {
                    value,
                    initialValue: value,
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
                    initialValue: value,
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
                    initialValue: value,
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

            it('value only should set initialValue', () => {
                const expected: FormControlState<string> = {
                    value,
                    initialValue: value,
                    disabled: false,
                    pristine: true,
                    untouched: true,
                    validators: [],
                };

                const result = initFormControl({
                    value,
                });

                expect(result).toEqual(expected);
            });

            it('intialValue should set initialValue', () => {
                const initialValue = 'initial';

                const expected: FormControlState<string> = {
                    value,
                    initialValue,
                    disabled: false,
                    pristine: true,
                    untouched: true,
                    validators: [],
                };

                const result = initFormControl({
                    value,
                    initialValue,
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
                        initialValue: value,
                    },
                    update: {
                        disabled: true,
                        pristine: false,
                        untouched: false,
                        validators: [validator],
                        value,
                        initialValue: value,
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

    describe('initFormArray', () => {
        it('should create valid form group with initTuple', () => {
            const expected: FormArrayState<string> = {
                controls: [
                    {
                        value,
                        validators: [validator],
                        disabled: false,
                        pristine: true,
                        untouched: true,
                        initialValue: value,
                    },
                ],
            };

            const result = initFormArray([[value, [validator]]]);

            expect(result).toEqual(expected);
        });

        it('should create valid form group with initUpdate', () => {
            const expected: FormArrayState<string> = {
                controls: [
                    {
                        value,
                        validators: [validator],
                        disabled: true,
                        pristine: false,
                        untouched: false,
                        initialValue: value,
                    },
                ],
            };

            const result = initFormArray([
                {
                    value,
                    validators: [validator],
                    disabled: true,
                    pristine: false,
                    untouched: false,
                },
            ]);

            expect(result).toEqual(expected);
        });
    });
});
