import {
    mapFormGroupControlStates,
    validatorOf,
    mergeFormGroupErrors,
    mergeFormControlErrors,
    mergeFormArrayErrors,
} from './utils';
import { initFormControl } from './init';
import { FormControlState, FormGroupErrors, FormControlErrors } from './types';

describe('utils', () => {
    describe('mapFormGroupControlStates', () => {
        it('should return {} for {}', () => {
            const input = {};

            const result = mapFormGroupControlStates(input, () => 'test');

            expect(result).toEqual({});
        });

        it('should map accordingly', () => {
            const input = {
                c1: initFormControl(['a']),
                c2: initFormControl(['b']),
            };

            const expected = {
                c1: 'a',
                c2: 'b',
            };

            const result = mapFormGroupControlStates(input, control => control.value);

            expect(result).toEqual(expected);
        });
    });

    describe('validatorOf', () => {
        it('should support value property', () => {
            const expected = { value: 'val' };

            const resultFunc = validatorOf(control => ({
                value: control.value,
            }));

            const result = resultFunc(initFormControl([expected.value]));

            expect(result).toEqual(expected);
        });

        it('should support dirty property', () => {
            const expected = { dirty: true };

            const resultFunc = validatorOf(control => ({
                dirty: control.dirty,
            }));

            const result = resultFunc({ pristine: false } as FormControlState<any>);

            expect(result).toEqual(expected);
        });

        it('should support pristine property', () => {
            const expected = { pristine: true };

            const resultFunc = validatorOf(control => ({
                pristine: control.pristine,
            }));

            const result = resultFunc({ pristine: true } as FormControlState<any>);

            expect(result).toEqual(expected);
        });

        it('should support touched property', () => {
            const expected = { touched: true };

            const resultFunc = validatorOf(control => ({
                touched: control.touched,
            }));

            const result = resultFunc({ untouched: false } as FormControlState<any>);

            expect(result).toEqual(expected);
        });

        it('should support untouched property', () => {
            const expected = { untouched: true };

            const resultFunc = validatorOf(control => ({
                untouched: control.untouched,
            }));

            const result = resultFunc({ untouched: true } as FormControlState<any>);

            expect(result).toEqual(expected);
        });

        it('should support disabled property', () => {
            const expected = { disabled: true };

            const resultFunc = validatorOf(control => ({
                disabled: control.disabled,
            }));

            const result = resultFunc({ disabled: true } as FormControlState<any>);

            expect(result).toEqual(expected);
        });

        it('should support enabled property', () => {
            const expected = { enabled: true };

            const resultFunc = validatorOf(control => ({
                enabled: control.enabled,
            }));

            const result = resultFunc({ disabled: false } as FormControlState<any>);

            expect(result).toEqual(expected);
        });

        it('should merge multiple validators', () => {
            const expected = { first: true, second: true };

            const resultFunc = validatorOf(
                control => ({
                    first: true,
                }),
                control => ({
                    second: true,
                })
            );

            const result = resultFunc({} as FormControlState<any>);

            expect(result).toEqual(expected);
        });
    });

    describe('mergeFormGroupErrors', () => {
        interface TestControls {
            stringControl: string;
            numberControl: number;
        }

        it('should merge not overriding controls', () => {
            const e1: FormGroupErrors<TestControls> = {
                stringControl: {
                    firstError: 'firstError',
                },
            };

            const e2: FormGroupErrors<TestControls> = {
                numberControl: {
                    secondError: 'secondError',
                },
            };

            const expected: FormGroupErrors<TestControls> = {
                stringControl: {
                    firstError: 'firstError',
                },
                numberControl: {
                    secondError: 'secondError',
                },
            };

            const result = mergeFormGroupErrors(e1, e2);

            expect(result).toEqual(expected);
        });

        it('should merge overriding controls + different attributes', () => {
            const e1: FormGroupErrors<TestControls> = {
                stringControl: {
                    firstError: 'firstError',
                },
            };

            const e2: FormGroupErrors<TestControls> = {
                stringControl: {
                    secondError: 'secondError',
                },
            };

            const expected: FormGroupErrors<TestControls> = {
                stringControl: {
                    firstError: 'firstError',
                    secondError: 'secondError',
                },
            };

            const result = mergeFormGroupErrors(e1, e2);

            expect(result).toEqual(expected);
        });

        it('should merge overriding controls + overriding attributes, choose last', () => {
            const e1: FormGroupErrors<TestControls> = {
                stringControl: {
                    firstError: 'firstError',
                    duplicateError: 'error1',
                },
            };

            const e2: FormGroupErrors<TestControls> = {
                stringControl: {
                    secondError: 'secondError',
                    duplicateError: 'error2',
                },
            };

            const expected: FormGroupErrors<TestControls> = {
                stringControl: {
                    firstError: 'firstError',
                    secondError: 'secondError',
                    duplicateError: 'error2',
                },
            };

            const result = mergeFormGroupErrors(e1, e2);

            expect(result).toEqual(expected);
        });

        it('should merge 3+ controls', () => {
            const e1: FormGroupErrors<TestControls> = {
                stringControl: {
                    firstError: 'firstError',
                },
                numberControl: {
                    otherError: 'otherError',
                },
            };

            const e2: FormGroupErrors<TestControls> = {
                stringControl: {
                    secondError: 'secondError',
                },
            };

            const e3: FormGroupErrors<TestControls> = {
                stringControl: {
                    thirdError: 'thirdError',
                },
            };

            const e4: FormGroupErrors<TestControls> = {
                numberControl: {
                    fourthError: 'fourthError',
                },
            };

            const expected: FormGroupErrors<TestControls> = {
                stringControl: {
                    firstError: 'firstError',
                    secondError: 'secondError',
                    thirdError: 'thirdError',
                },
                numberControl: {
                    fourthError: 'fourthError',
                    otherError: 'otherError',
                },
            };

            const result = mergeFormGroupErrors(e1, e2, e3, e4);

            expect(result).toEqual(expected);
        });

        it('should return null on all inputs null', () => {
            const result = mergeFormGroupErrors(null, null);

            expect(result).toBe(null);
        });

        it('should return first error on merge first error, second null', () => {
            const e1: FormGroupErrors<TestControls> = {
                stringControl: {
                    firstError: 'firstError',
                },
            };

            const result = mergeFormGroupErrors(e1, null);

            expect(result).toEqual(e1);
        });

        it('should return second error on merge first null, second error', () => {
            const e2: FormGroupErrors<TestControls> = {
                stringControl: {
                    firstError: 'firstError',
                },
            };

            const result = mergeFormGroupErrors(null, e2);

            expect(result).toEqual(e2);
        });

        it('should return null on empty input', () => {
            const result = mergeFormGroupErrors();

            expect(result).toBe(null);
        });
    });

    describe('mergeFormControlErrors', () => {
        it('null, null should return null', () => {
            const result = mergeFormControlErrors(null, null);

            expect(result).toBe(null);
        });

        it('null, error2 should return error2', () => {
            const error2: FormControlErrors = {
                error2: 'error2',
            };

            const result = mergeFormControlErrors(null, error2);

            expect(result).toBe(error2);
        });

        it('error1, null should return error1', () => {
            const error1: FormControlErrors = {
                error1: 'error1',
            };

            const result = mergeFormControlErrors(error1, null);

            expect(result).toBe(error1);
        });

        it('should merge 2 errors', () => {
            const error1: FormControlErrors = {
                error1: 'error1',
            };

            const error2: FormControlErrors = {
                error2: 'error2',
            };

            const expected = {
                error1: 'error1',
                error2: 'error2',
            };

            const result = mergeFormControlErrors(error1, error2);

            expect(result).toEqual(expected);
        });

        it('should override duplicate attribute of first error', () => {
            const error1: FormControlErrors = {
                duplicate: 'error1',
            };

            const error2: FormControlErrors = {
                duplicate: 'error2',
            };

            const expected = {
                duplicate: 'error2',
            };

            const result = mergeFormControlErrors(error1, error2);

            expect(result).toEqual(expected);
        });

        it('should merge 3+ errors', () => {
            const error1: FormControlErrors = {
                error1: 'error1',
            };

            const error2: FormControlErrors = {
                error2: 'error2',
            };

            const error3: FormControlErrors = {
                error3: 'error3',
            };

            const expected = {
                error1: 'error1',
                error2: 'error2',
                error3: 'error3',
            };

            const result = mergeFormControlErrors(error1, error2, error3);

            expect(result).toEqual(expected);
        });
    });

    describe('mergeFormArrayErrors', () => {
        it('should merge multiple errors', () => {
            const firstError = {
                first: 'first',
            };

            const secondError = {
                second: 'second',
            };

            const thirdError = {
                third: 'third',
            };

            const expected = [
                {
                    ...firstError,
                    ...secondError,
                },
                thirdError,
            ];

            const result = mergeFormArrayErrors([firstError], [secondError, thirdError]);

            expect(result).toEqual(expected);
        });

        it('null, null should return null', () => {
            const errors = [null, null];

            const result = mergeFormArrayErrors(errors);

            expect(result).toBeNull();
        });

        it('null, error & null, null, null should return null, error, null', () => {
            const error = { error: 'error' };
            const errors = [null, error];

            const result = mergeFormArrayErrors([null, null, null], errors);

            expect(result).toEqual([...errors, null]);
        });
    });
});
