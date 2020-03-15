import {
    FormArrayState,
    FormArrayUpdate,
    FormControlUpdate,
    FormGroupState,
    FormGroupUpdate,
} from './types';
import { initFormArray, initFormControl, initFormGroup } from './init';
import { reduceFormArray, reduceFormControl, reduceFormGroup } from './reducer';

describe('reducer', () => {
    describe('reduceFormControl', () => {
        it('empty update should do nothing', () => {
            const control = initFormControl(['test']);

            const update = {};

            const result = reduceFormControl(control, update);

            expect(result).toEqual(control);
        });

        it('value update should only update value', () => {
            const control = initFormControl(['test']);

            const expected = {
                ...control,
                value: 'new',
            };

            const update: FormControlUpdate<string> = {
                value: 'new',
            };

            const result = reduceFormControl(control, update);

            expect(result).toEqual(expected);
        });

        it('undefined update should do nothing', () => {
            const control = initFormControl(['test']);

            const update = undefined;

            const result = reduceFormControl(control, update);

            expect(result).toEqual(control);
        });

        it('null update should do nothing', () => {
            const control = initFormControl(['test']);

            const update = null;

            const result = reduceFormControl(control, update);

            expect(result).toEqual(control);
        });
    });

    describe('reduceFormGroup', () => {
        it('empty update should do nothing', () => {
            const group = initFormGroup({ test: ['test'] });

            const update = {};

            const result = reduceFormGroup(group, update);

            expect(result).toEqual(group);
        });

        it('undefined update should do nothing', () => {
            const group = initFormGroup({ test: ['test'] });

            const update = undefined;

            const result = reduceFormGroup(group, update);

            expect(result).toEqual(group);
        });

        it('group update should only update affected', () => {
            interface TestControls {
                affected: string;
                unaffected: string;
            }

            const group: FormGroupState<TestControls> = initFormGroup({
                affected: ['affected'],
                unaffected: ['unaffected'],
            });

            const update: FormGroupUpdate<TestControls> = {
                controls: {
                    affected: {
                        value: 'new',
                        disabled: true,
                    },
                },
            };

            const expected: FormGroupState<TestControls> = {
                ...group,
                controls: {
                    ...group.controls,
                    affected: {
                        ...group.controls.affected,
                        value: 'new',
                        disabled: true,
                    },
                },
            };

            const result = reduceFormGroup(group, update);

            expect(result).toEqual(expected);
        });
    });

    describe('reduceFormArray', () => {
        [{}, undefined, null].forEach(update => {
            it(`${JSON.stringify(update)} update should do nothing`, () => {
                const array = initFormArray([['value]']]);

                const result = reduceFormArray(array, update);

                expect(result).toEqual(array);
            });
        });

        it('array update should only update affected', () => {
            const value = 'value';
            const initialValue = 'initial';
            const pristine = false;

            const controlUpdate: FormControlUpdate<string> = {
                value,
                pristine,
            };

            const array = initFormArray([['1'], [initialValue], ['3'], ['4']]);

            const update: FormArrayUpdate<string> = {
                controls: [null, controlUpdate, null],
            };

            const expected: FormArrayState<string> = {
                controls: [
                    initFormControl(['1']),
                    initFormControl({ value, pristine, initialValue }),
                    initFormControl(['3']),
                    initFormControl(['4']),
                ],
                validators: [],
            };

            const result = reduceFormArray(array, update);

            expect(result).toEqual(expected);
        });
    });
});
