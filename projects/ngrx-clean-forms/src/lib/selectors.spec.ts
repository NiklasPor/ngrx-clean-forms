import { initFormControl, initFormGroup, initFormArray } from './init';
import {
    getFormControlErrors,
    getFormControlSummary,
    getFormGroupControlSummaries,
    getFormGroupErrors,
    getFormGroupPristine,
    getFormGroupSummary,
    getFormGroupUntouched,
    getFormArrayErrors,
    getFormArraySummary,
    getFormArrayControlSummaries,
    getFormArrayPristine,
    getFormArrayUntouched,
    getFormGroupChanged,
    getFormArrayChanged,
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
        [undefined, null, 0, { value: 'value' }].forEach(value => {
            it(`${value} match should return changed: false`, () => {
                const result = getFormControlSummary(initFormControl([value]));

                expect(result.changed).toBe(false);
            });
        });

        it('should return changed: true for changed simple value', () => {
            const result = getFormControlSummary(
                initFormControl({
                    value: 'value',
                    initialValue: 'initialValue',
                })
            );

            expect(result.changed).toBe(true);
        });

        it('should return changed: true for object key value change', () => {
            const result = getFormControlSummary(
                initFormControl({
                    value: { deeper: { deep: 'value' } },
                    initialValue: { deeper: { deep: 'initialValue' } },
                })
            );

            expect(result.changed).toBe(true);
        });
    });

    describe('getFormControlSummary', () => {
        it('should return valid = true, errors = null, controls for valid control', () => {
            const control: FormControlState<string> = {
                pristine: true,
                untouched: true,
                value: '',
                initialValue: '',
                validators: [],
                disabled: false,
            };

            const expected: FormControlSummary<string> = {
                pristine: true,
                untouched: true,
                value: '',
                initialValue: '',
                validators: [],
                disabled: false,
                errors: null,
                valid: true,
                changed: false,
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
                initialValue: '',
                validators,
                disabled: false,
            };

            const expected: FormControlSummary<string> = {
                pristine: control.pristine,
                untouched: control.untouched,
                value: control.value,
                initialValue: '',
                validators,
                disabled: false,
                errors: error,
                valid: false,
                changed: false,
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
                initialValue: '',
                validators: [],
                disabled: false,
            };

            const expected: FormControlSummary<string> = {
                pristine: control.pristine,
                untouched: control.untouched,
                value: control.value,
                validators: [],
                initialValue: '',
                disabled: false,
                errors: additionalError,
                valid: false,
                changed: false,
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
                initialValue: '',
                validators,
                disabled: false,
            };

            const expected: FormControlSummary<string> = {
                pristine: control.pristine,
                untouched: control.untouched,
                value: control.value,
                initialValue: '',
                validators,
                disabled: false,
                errors: { alwaysTrue: true, additionalError: true },
                valid: false,
                changed: false,
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

    describe('getFormGroupChanged', () => {
        it('only initial values should return false', () => {
            const result = getFormGroupChanged({
                first: getFormControlSummary(initFormControl(['value'])),
                second: getFormControlSummary(initFormControl(['value'])),
            });

            expect(result).toBe(false);
        });

        it('one changed value should return true', () => {
            const result = getFormGroupChanged({
                first: getFormControlSummary(initFormControl(['value'])),
                second: getFormControlSummary(
                    initFormControl({ value: 'value', initialValue: 'changed' })
                ),
            });

            expect(result).toBe(true);
        });

        it('all changed values should return true', () => {
            const result = getFormGroupChanged({
                first: getFormControlSummary(
                    initFormControl({ value: 'value', initialValue: 'changed' })
                ),
                second: getFormControlSummary(
                    initFormControl({ value: 'value', initialValue: 'changed' })
                ),
            });

            expect(result).toBe(true);
        });
    });

    describe('getFormArrayChanged', () => {
        it('only initial values should return false', () => {
            const result = getFormArrayChanged([
                getFormControlSummary(initFormControl(['value'])),
                getFormControlSummary(initFormControl(['value'])),
            ]);

            expect(result).toBe(false);
        });

        it('one changed value should return true', () => {
            const result = getFormArrayChanged([
                getFormControlSummary(initFormControl(['value'])),
                getFormControlSummary(
                    initFormControl({ value: 'value', initialValue: 'initialValue' })
                ),
            ]);

            expect(result).toBe(true);
        });

        it('all changed values should return true', () => {
            const result = getFormArrayChanged([
                getFormControlSummary(
                    initFormControl({ value: 'value', initialValue: 'initialValue' })
                ),
                getFormControlSummary(
                    initFormControl({ value: 'value', initialValue: 'initialValue' })
                ),
            ]);

            expect(result).toBe(true);
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
                        initialValue: 'initial',
                        disabled: false,
                        pristine: true,
                        untouched: true,
                        valid: false,
                        validators: group.controls.stringControl.validators,
                        errors: {
                            externalError: true,
                            controlError: true,
                        },
                        changed: false,
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
                changed: false,
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
                        initialValue: 'initial',
                        disabled: false,
                        pristine: true,
                        untouched: true,
                        valid: false,
                        validators: group.controls.stringControl.validators,
                        errors: {
                            externalError: true,
                        },
                        changed: false,
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
                changed: false,
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
                        initialValue: 'initial',
                        disabled: false,
                        pristine: true,
                        untouched: true,
                        valid: false,
                        validators: group.controls.stringControl.validators,
                        errors: {
                            stringError: true,
                        },
                        changed: false,
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
                changed: false,
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
                        initialValue: 'initial',
                        disabled: false,
                        pristine: true,
                        untouched: true,
                        valid: true,
                        validators: group.controls.stringControl.validators,
                        errors: null,
                        changed: false,
                    },
                },
                errors: null,
                pristine: true,
                untouched: true,
                valid: true,
                changed: false,
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

            const group = initFormArray([[''], ['', [() => error]], ['']]);

            const expected = [null, error, null];

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
                        initialValue: 'initial',
                        disabled: false,
                        pristine: true,
                        untouched: true,
                        valid: false,
                        validators: array.controls[0].validators,
                        errors: {
                            externalError: true,
                            controlError: true,
                        },
                        changed: false,
                    },
                ],
                keys: [0],
                errors: [
                    {
                        externalError: true,
                        controlError: true,
                    },
                ],
                pristine: true,
                untouched: true,
                valid: false,
                changed: false,
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
                        initialValue: 'initial',
                        disabled: false,
                        pristine: true,
                        untouched: true,
                        valid: false,
                        validators: array.controls[0].validators,
                        errors: {
                            externalError: true,
                        },
                        changed: false,
                    },
                ],
                keys: [0],
                errors: [
                    {
                        externalError: true,
                    },
                ],
                pristine: true,
                untouched: true,
                valid: false,
                changed: false,
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
                        initialValue: 'initial',
                        disabled: false,
                        pristine: true,
                        untouched: true,
                        valid: false,
                        validators: array.controls[0].validators,
                        errors: {
                            stringError: true,
                        },
                        changed: false,
                    },
                ],
                keys: [0],
                errors: [
                    {
                        stringError: true,
                    },
                ],
                pristine: true,
                untouched: true,
                valid: false,
                changed: false,
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
                        initialValue: 'initial',
                        disabled: false,
                        pristine: true,
                        untouched: true,
                        valid: true,
                        validators: array.controls[0].validators,
                        errors: null,
                        changed: false,
                    },
                ],
                keys: [0],
                errors: null,
                pristine: true,
                untouched: true,
                valid: true,
                changed: false,
            };

            const result = getFormArraySummary(array);

            expect(result).toEqual(expected);
        });
    });
});
