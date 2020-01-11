import { initFormControl, initFormGroup } from './init';
import { reduceFormControl, reduceFormGroup } from './reducer';
import { FormControlUpdate } from 'ngrx-clean-forms/lib/types';
import { FormGroupUpdate, FormGroupState } from './types';

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
    });

    describe('reduceFormGroup', () => {
        it('empty update should do nothing', () => {
            const group = initFormGroup({ test: ['test'] });

            const update = {};

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
});
