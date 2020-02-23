import { FormControlState } from './types';
import { resetFormControl } from './reset';
import { initFormControl } from './init';

describe('resetFormControl', () => {
    const initialValue = 'initial';
    const validators = [() => null];

    const control: FormControlState<string> = {
        disabled: true,
        initialValue,
        pristine: false,
        untouched: false,
        validators,
        value: 'value',
    };

    it('should keep validators', () => {
        const result = resetFormControl(control);

        expect(result.validators).toBe(validators);
    });

    it('should reset everything except validators to initial', () => {
        const result = resetFormControl(control);
        const expected = initFormControl([initialValue]);

        expected.validators = validators;

        expect(result).toEqual(expected);
    });

    it('should set initialValue and value if passed', () => {
        const newValue = 'newValue';

        const result = resetFormControl(control, newValue);

        expect(result.value).toEqual(newValue);
        expect(result.initialValue).toEqual(newValue);
    });
});
