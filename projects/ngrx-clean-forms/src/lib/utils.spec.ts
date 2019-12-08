import { mapFormControlStates, validatorOf } from './utils';
import { initFormControl } from './init';
import { FormControlState } from './types';

describe('utils', () => {
    describe('mapFormControlStates', () => {
        it('should return {} for {}', () => {
            const input = {};

            const result = mapFormControlStates(input, () => 'test');

            expect(result).toEqual({});
        });

        it('should map accordingly', () => {
            const input = {
                c1: initFormControl('a'),
                c2: initFormControl('b'),
            };

            const expected = {
                c1: 'a',
                c2: 'b',
            };

            const result = mapFormControlStates(input, control => control.value);

            expect(result).toEqual(expected);
        });
    });

    describe('validatorOf', () => {
        it('should support value property', () => {
            const expected = { value: 'val' };

            const resultFunc = validatorOf(control => ({
                value: control.value,
            }));

            const result = resultFunc(initFormControl(expected.value));

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
    });
});
