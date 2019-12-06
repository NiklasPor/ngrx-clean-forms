import { AbstractControl, ValidatorFn, ValidationErrors } from '@angular/forms';
import { FormGroupControls, FormControlState, Validator } from './types';

export function mapFormControls<TControls extends FormGroupControls, R>(
    controls: TControls,
    mapFunc: (control: FormControlState<any>, key: string) => R
): {
    [K in keyof TControls]: R;
} {
    const result = Object.entries(controls)
        .map(([key, control]) => ({
            [key]: mapFunc(control, key),
        }))
        .reduce((ctrl1, ctrl2) => ({ ...ctrl1, ...ctrl2 }), {});

    return result as {
        [K in keyof TControls]: R;
    };
}

export function of<T>(fn: ValidatorFn): Validator<T> {
    return (control: FormControlState<T>) =>
        fn({
            value: control.value,
        } as AbstractControl);
}
