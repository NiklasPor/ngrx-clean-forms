import { mapFormControlStates, validatorOf } from './utils';
import { initFormControl, initFormGroup } from './init';
import { FormControlState, FormGroupState, FormControlSummary } from './types';
import {
    getFormControlErrors,
    getFormGroupErrors,
    getFormControlSummary,
    getFormGroupPristine,
    getFormGroupUntouched,
    getFormGroupSummary,
} from './selectors';

describe('selectors', () => {
    describe('getFormControlErrors', () => {
        it('should return null for empty validators', () => {
            const control = initFormControl({ value: '' });

            const result = getFormControlErrors(control);

            expect(result).toBeNull();
        });

        it('should return invalid key', () => {
            const validator = () => ({
                alwaysTrue: true,
            });
            const control = initFormControl(['', [validator]]);

            const expected = {
                alwaysTrue: true,
            };
            const result = getFormControlErrors(control);

            expect(result).toEqual(expected);
        });

        it('should merge keys', () => {
            const validators = [
                () => ({
                    alwaysTrue: true,
                }),
                () => ({
                    alwaysFalse: false,
                }),
            ];
            const control = initFormControl(['', validators]);

            const expected = {
                alwaysTrue: true,
                alwaysFalse: false,
            };
            const result = getFormControlErrors(control);

            expect(result).toEqual(expected);
        });
    });

    describe('getFormGroupErrors', () => {
        it('should return null for no control errors', () => {
            const group = {
                controls: {
                    c1: initFormControl(['']),
                },
            } as FormGroupState<{ c1: string }>;

            const result = getFormGroupErrors(group);

            expect(result).toBe(null);
        });

        it('should return control + error', () => {
            const validator = () => ({
                alwaysTrue: true,
            });

            const group = {
                controls: {
                    c1: initFormControl(['', [validator]]),
                },
            } as FormGroupState<{ c1: string }>;

            const expected = {
                c1: {
                    alwaysTrue: true,
                },
            };

            const result = getFormGroupErrors(group);

            expect(result).toEqual(expected);
        });

        it('should return multiple controls + errors', () => {
            const validatorAlwaysTrue = () => ({
                alwaysTrue: true,
            });

            const validatorAlwaysFalse = () => ({
                alwaysFalse: false,
            });

            const group = {
                controls: {
                    c1: initFormControl(['', [validatorAlwaysTrue]]),
                    c2: initFormControl(['', [validatorAlwaysFalse]]),
                },
            } as FormGroupState<{ c1: string; c2: string }>;

            const expected = {
                c1: {
                    alwaysTrue: true,
                },
                c2: {
                    alwaysFalse: false,
                },
            };

            const result = getFormGroupErrors(group);

            expect(result).toEqual(expected);
        });
    });

    describe('getFormControlSummary', () => {
        it('should return valid = true, errors = null, controls for valid control', () => {
            const control: FormControlState<string> = {
                pristine: true,
                untouched: true,
                value: '',
                validators: [],
                disabled: false,
            };

            const expected: FormControlSummary<string> = {
                pristine: true,
                untouched: true,
                value: '',
                validators: [],
                disabled: false,
                errors: null,
                valid: true,
            };

            const result = getFormControlSummary(control);

            expect(result).toEqual(expected);
        });

        it('should return valid = false, errors = errors, controls for invalid control', () => {
            const error = {
                alwaysTrue: true,
            };

            const validators = [() => error];

            const control: FormControlState<string> = {
                pristine: true,
                untouched: true,
                value: '',
                validators,
                disabled: false,
            };

            const expected: FormControlSummary<string> = {
                pristine: control.pristine,
                untouched: control.untouched,
                value: control.value,
                validators,
                disabled: false,
                errors: error,
                valid: false,
            };

            const result = getFormControlSummary(control);

            expect(result).toEqual(expected);
        });
    });

    describe('getFormGroupPristine', () => {
        it('all controls pristine should return true', () => {
            const group = {
                controls: {
                    c1: {
                        pristine: true,
                    } as FormControlState<any>,
                    c2: {
                        pristine: true,
                    } as FormControlState<any>,
                },
            } as FormGroupState<any>;

            const result = getFormGroupPristine(group);

            expect(result).toEqual(true);
        });

        it('one control dirty should return false', () => {
            const group = {
                controls: {
                    c1: {
                        pristine: true,
                    } as FormControlState<any>,
                    c2: {
                        pristine: false,
                    } as FormControlState<any>,
                },
            } as FormGroupState<any>;

            const result = getFormGroupPristine(group);

            expect(result).toEqual(false);
        });
    });

    describe('getFormGroupUntouched', () => {
        it('all controls untouched should return true', () => {
            const group = {
                controls: {
                    c1: {
                        untouched: true,
                    } as FormControlState<any>,
                    c2: {
                        untouched: true,
                    } as FormControlState<any>,
                },
            } as FormGroupState<any>;

            const result = getFormGroupUntouched(group);

            expect(result).toEqual(true);
        });

        it('one control touched should return false', () => {
            const group = {
                controls: {
                    c1: {
                        untouched: true,
                    } as FormControlState<any>,
                    c2: {
                        untouched: false,
                    } as FormControlState<any>,
                },
            } as FormGroupState<any>;

            const result = getFormGroupUntouched(group);

            expect(result).toEqual(false);
        });
    });

    describe('getFormGroupSummary', () => {
        it('all valid should return errors = null & valid = true', () => {
            const group = initFormGroup({
                c1: [''],
            });

            const result = getFormGroupSummary(group);

            expect(result.errors).toEqual(null);
            expect(result.valid).toEqual(true);
        });

        it('one error should return errors & valid = false', () => {
            const error = {
                alwaysTrue: true,
            };

            const group = initFormGroup({
                c1: ['', [() => error]],
                c2: [''],
            });

            const expected = {
                c1: error,
            };

            const result = getFormGroupSummary(group);

            expect(result.errors).toEqual(expected);
            expect(result.valid).toEqual(false);
        });
    });
});
