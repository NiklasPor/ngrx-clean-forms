import { initFormControl, initFormGroup, initFormArray } from './init';
import {
    getFormControlErrors,
    getFormControlSummary,
    getFormGroupControlSummaries,
    getFormGroupErrors,
    getFormGroupPristine,
    getFormGroupSummary,
    getFormGroupUntouched,
    mergeFormControlErrors,
    mergeFormGroupErrors,
    getFormArrayErrors,
    getFormArraySummary,
    getFormArrayControlSummaries,
    getFormArrayPristine,
    getFormArrayUntouched,
    mergeFormArrayErrors,
} from './selectors';
import {
    FormControlErrors,
    FormControlState,
    FormControlSummary,
    FormGroupErrors,
    FormGroupState,
    FormGroupSummary,
    FormArrayState,
    FormArrayErrors,
    FormArraySummary,
} from './types';

describe('selectors', () => {
    describe('getFormControlErrors', () => {
        it('should return [] for empty validators', () => {
            const control = initFormControl({ value: '' });

            const result = getFormControlErrors(control);

            expect(result).toEqual([]);
        });

        it('should return error', () => {
            const validator = () => ({
                alwaysTrue: true,
            });
            const control = initFormControl(['', [validator]]);

            const expected = [
                {
                    alwaysTrue: true,
                },
            ];
            const result = getFormControlErrors(control);

            expect(result).toEqual(expected);
        });

        it('should return multiple erros', () => {
            const validators = [
                () => ({
                    alwaysTrue: true,
                }),
                () => ({
                    alwaysFalse: false,
                }),
            ];
            const control = initFormControl(['', validators]);

            const expected = [
                {
                    alwaysTrue: true,
                },
                {
                    alwaysFalse: false,
                },
            ];
            const result = getFormControlErrors(control);

            expect(result).toEqual(expected);
        });
    });

    describe('getFormGroupErrors', () => {
        it('should return null for no control errors', () => {
            const group = initFormGroup({
                c1: ['c1'],
            });

            const result = getFormGroupErrors(getFormGroupControlSummaries(group.controls));

            expect(result).toBe(null);
        });

        it('should return control + error', () => {
            const validator = () => ({
                alwaysTrue: true,
            });

            const group = initFormGroup({
                c1: ['c1', [validator]],
            });

            const expected = {
                c1: {
                    alwaysTrue: true,
                },
            };

            const result = getFormGroupErrors(getFormGroupControlSummaries(group.controls));

            expect(result).toEqual(expected);
        });

        it('should return multiple controls + errors', () => {
            const validatorAlwaysTrue = () => ({
                alwaysTrue: true,
            });

            const validatorAlwaysFalse = () => ({
                alwaysFalse: false,
            });

            const group = initFormGroup({
                c1: ['', [validatorAlwaysTrue]],
                c2: ['', [validatorAlwaysFalse]],
            });

            const expected = {
                c1: {
                    alwaysTrue: true,
                },
                c2: {
                    alwaysFalse: false,
                },
            };

            const result = getFormGroupErrors(getFormGroupControlSummaries(group.controls));

            expect(result).toEqual(expected);
        });
    });

    describe('getFormArrayErrors', () => {
        it('should return null for no control errors', () => {
            const array = initFormArray([['c1']]);

            const result = getFormArrayErrors(getFormArrayControlSummaries(array.controls));

            expect(result).toBe(null);
        });

        it('should return control + error', () => {
            const validator = () => ({
                alwaysTrue: true,
            });

            const array = initFormArray([['c1', [validator]]]);

            const expected = [
                {
                    alwaysTrue: true,
                },
            ];

            const result = getFormArrayErrors(getFormArrayControlSummaries(array.controls));

            expect(result).toEqual(expected);
        });

        it('should return multiple controls + errors', () => {
            const validatorAlwaysTrue = () => ({
                alwaysTrue: true,
            });

            const validatorAlwaysFalse = () => ({
                alwaysFalse: false,
            });

            const group = initFormArray([
                ['', [validatorAlwaysTrue]],
                ['', [validatorAlwaysFalse]],
            ]);

            const expected = [
                {
                    alwaysTrue: true,
                },
                {
                    alwaysFalse: false,
                },
            ];

            const result = getFormArrayErrors(getFormArrayControlSummaries(group.controls));

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

        it('should return valid = false, errors = errors, controls for additional errors', () => {
            const additionalError = {
                additionalError: true,
            };

            const control: FormControlState<string> = {
                pristine: true,
                untouched: true,
                value: '',
                validators: [],
                disabled: false,
            };

            const expected: FormControlSummary<string> = {
                pristine: control.pristine,
                untouched: control.untouched,
                value: control.value,
                validators: [],
                disabled: false,
                errors: additionalError,
                valid: false,
            };

            const result = getFormControlSummary(control, additionalError);

            expect(result).toEqual(expected);
        });

        it('should merge errors with additional errors', () => {
            const additionalError = {
                additionalError: true,
            };

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
                errors: { alwaysTrue: true, additionalError: true },
                valid: false,
            };

            const result = getFormControlSummary(control, additionalError);

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

    describe('getFormArrayPristine', () => {
        it('all controls pristine should return true', () => {
            const array = {
                controls: [
                    {
                        pristine: true,
                    } as FormControlState<any>,
                    {
                        pristine: true,
                    } as FormControlState<any>,
                ],
            };

            const result = getFormArrayPristine(array);

            expect(result).toEqual(true);
        });

        it('one control dirty should return false', () => {
            const array = {
                controls: [
                    {
                        pristine: true,
                    } as FormControlState<any>,
                    {
                        pristine: false,
                    } as FormControlState<any>,
                ],
            };

            const result = getFormArrayPristine(array);

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

    describe('getFormArrayUntouched', () => {
        it('all controls untouched should return true', () => {
            const array = {
                controls: [
                    {
                        untouched: true,
                    } as FormControlState<any>,
                    {
                        untouched: true,
                    } as FormControlState<any>,
                ],
            };

            const result = getFormArrayUntouched(array);

            expect(result).toEqual(true);
        });

        it('one control touched should return false', () => {
            const array = {
                controls: [
                    {
                        untouched: true,
                    } as FormControlState<any>,
                    {
                        untouched: false,
                    } as FormControlState<any>,
                ],
            };

            const result = getFormArrayUntouched(array);

            expect(result).toEqual(false);
        });
    });

    describe('getFormGroupSummary', () => {
        interface TestControls {
            stringControl: string;
        }

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

        it('should summarize with error for group + controls', () => {
            const group = initFormGroup<TestControls>({
                stringControl: [
                    'initial',
                    [
                        () => ({
                            controlError: true,
                        }),
                    ],
                ],
            });

            const additionalError: FormGroupErrors<TestControls> = {
                stringControl: {
                    externalError: true,
                },
            };

            const expected: FormGroupSummary<TestControls> = {
                controls: {
                    stringControl: {
                        value: 'initial',
                        disabled: false,
                        pristine: true,
                        untouched: true,
                        valid: false,
                        validators: group.controls.stringControl.validators,
                        errors: {
                            externalError: true,
                            controlError: true,
                        },
                    },
                },
                errors: {
                    stringControl: {
                        externalError: true,
                        controlError: true,
                    },
                },
                pristine: true,
                untouched: true,
                valid: false,
            };

            const result = getFormGroupSummary(group, additionalError);

            expect(result).toEqual(expected);
        });

        it('should set valid on control & group accordingly - only additional error', () => {
            const group = initFormGroup<TestControls>({
                stringControl: ['initial'],
            });

            const additionalError: FormGroupErrors<TestControls> = {
                stringControl: {
                    externalError: true,
                },
            };

            const expected: FormGroupSummary<TestControls> = {
                controls: {
                    stringControl: {
                        value: 'initial',
                        disabled: false,
                        pristine: true,
                        untouched: true,
                        valid: false,
                        validators: group.controls.stringControl.validators,
                        errors: {
                            externalError: true,
                        },
                    },
                },
                errors: {
                    stringControl: {
                        externalError: true,
                    },
                },
                pristine: true,
                untouched: true,
                valid: false,
            };

            const result = getFormGroupSummary(group, additionalError);

            expect(result).toEqual(expected);
        });

        it('should set valid on control & group accordingly - only form error', () => {
            const group = initFormGroup<TestControls>({
                stringControl: [
                    'initial',
                    [
                        () => ({
                            stringError: true,
                        }),
                    ],
                ],
            });

            const expected: FormGroupSummary<TestControls> = {
                controls: {
                    stringControl: {
                        value: 'initial',
                        disabled: false,
                        pristine: true,
                        untouched: true,
                        valid: false,
                        validators: group.controls.stringControl.validators,
                        errors: {
                            stringError: true,
                        },
                    },
                },
                errors: {
                    stringControl: {
                        stringError: true,
                    },
                },
                pristine: true,
                untouched: true,
                valid: false,
            };

            const result = getFormGroupSummary(group);

            expect(result).toEqual(expected);
        });

        it('should return summary on null errors', () => {
            const group = initFormGroup<TestControls>({
                stringControl: ['initial'],
            });

            const expected: FormGroupSummary<TestControls> = {
                controls: {
                    stringControl: {
                        value: 'initial',
                        disabled: false,
                        pristine: true,
                        untouched: true,
                        valid: true,
                        validators: group.controls.stringControl.validators,
                        errors: null,
                    },
                },
                errors: null,
                pristine: true,
                untouched: true,
                valid: true,
            };

            const result = getFormGroupSummary(group);

            expect(result).toEqual(expected);
        });
    });

    describe('getFormArraySummary', () => {
        it('all valid should return errors = null & valid = true', () => {
            const group = initFormArray([['']]);

            const result = getFormGroupSummary(group);

            expect(result.errors).toEqual(null);
            expect(result.valid).toEqual(true);
        });

        it('one error should return errors & valid = false', () => {
            const error = {
                alwaysTrue: true,
            };

            const group = initFormArray([['', [() => error]], ['']]);

            const expected = [null, error];

            const result = getFormArraySummary(group);

            expect(result.errors).toEqual(expected);
            expect(result.valid).toEqual(false);
        });

        it('should summarize with error for array + controls', () => {
            const validator = () => ({
                controlError: true,
            });

            const array = initFormArray([['initial', [validator]]]);

            const additionalError: FormArrayErrors = [
                {
                    externalError: true,
                },
            ];

            const expected: FormArraySummary<string> = {
                controls: [
                    {
                        value: 'initial',
                        disabled: false,
                        pristine: true,
                        untouched: true,
                        valid: false,
                        validators: array.controls[0].validators,
                        errors: {
                            externalError: true,
                            controlError: true,
                        },
                    },
                ],
                errors: [
                    {
                        externalError: true,
                        controlError: true,
                    },
                ],
                pristine: true,
                untouched: true,
                valid: false,
            };

            const result = getFormArraySummary(array, additionalError);

            expect(result).toEqual(expected);
        });

        it('should set valid on control & array accordingly - only additional error', () => {
            const array = initFormArray([['initial']]);

            const additionalError: FormArrayErrors = [
                {
                    externalError: true,
                },
            ];

            const expected: FormArraySummary<string> = {
                controls: [
                    {
                        value: 'initial',
                        disabled: false,
                        pristine: true,
                        untouched: true,
                        valid: false,
                        validators: array.controls[0].validators,
                        errors: {
                            externalError: true,
                        },
                    },
                ],
                errors: [
                    {
                        externalError: true,
                    },
                ],
                pristine: true,
                untouched: true,
                valid: false,
            };

            const result = getFormArraySummary(array, additionalError);

            expect(result).toEqual(expected);
        });

        it('should set valid on control & array accordingly - only form error', () => {
            const validator = () => ({
                stringError: true,
            });

            const array = initFormArray([['initial', [validator]]]);

            const expected: FormArraySummary<string> = {
                controls: [
                    {
                        value: 'initial',
                        disabled: false,
                        pristine: true,
                        untouched: true,
                        valid: false,
                        validators: array.controls[0].validators,
                        errors: {
                            stringError: true,
                        },
                    },
                ],
                errors: [
                    {
                        stringError: true,
                    },
                ],
                pristine: true,
                untouched: true,
                valid: false,
            };

            const result = getFormArraySummary(array);

            expect(result).toEqual(expected);
        });

        it('should return summary on null errors', () => {
            const array = initFormArray([['initial']]);

            const expected: FormArraySummary<string> = {
                controls: [
                    {
                        value: 'initial',
                        disabled: false,
                        pristine: true,
                        untouched: true,
                        valid: true,
                        validators: array.controls[0].validators,
                        errors: null,
                    },
                ],
                errors: null,
                pristine: true,
                untouched: true,
                valid: true,
            };

            const result = getFormArraySummary(array);

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

    fdescribe('mergeFormArrayErrors', () => {
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
