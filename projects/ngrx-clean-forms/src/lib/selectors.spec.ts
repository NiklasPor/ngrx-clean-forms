import { mapFormControlStates, validatorOf } from './utils';
import { initFormControl, initFormGroup } from './init';
import {
    FormControlState,
    FormGroupState,
    FormControlSummary,
    FormGroupErrors,
    FormControlErrors,
    FormGroupSummary,
} from './types';
import {
    getFormControlErrors,
    getFormGroupErrors,
    getFormControlSummary,
    getFormGroupPristine,
    getFormGroupUntouched,
    getFormGroupSummary,
    mergeFormGroupErrors,
    mergeFormControlErrors,
    getFormGroupSummaryWithErrors,
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

    describe('getFormGroupSummaryWithErrors', () => {
        interface TestControls {
            stringControl: string;
        }
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

            const result = getFormGroupSummaryWithErrors(group, additionalError);

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

            const result = getFormGroupSummaryWithErrors(group, additionalError);

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

            const result = getFormGroupSummaryWithErrors(group);

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

            const result = getFormGroupSummaryWithErrors(group);

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
});
