import { initFormControl } from './init';
import { reduceFormControl } from './reducer';
import { FormControlUpdate } from 'ngrx-clean-forms/lib/types';

describe('reducer', () => {
    describe('reduceFormControl', () => {
        it('empty update should do nothing', () => {
            const control = initFormControl('test');

            const update = {};

            const result = reduceFormControl(control, update);

            expect(result).toEqual(control);
        });

        it('value update should only update value', () => {
            const control = initFormControl('test');

            const update: FormControlUpdate<string> = {
                value: 'new',
            };

            const result = reduceFormControl(control, update);

            expect(result.pristine).toEqual(control.pristine);
            expect(result.untouched).toEqual(control.untouched);
            expect(result.validators).toEqual(control.validators);
            expect(result.value).toEqual(update.value);
        });
    });
});
