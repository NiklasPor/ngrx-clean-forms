import { AbstractControl, ValidatorFn, ValidationErrors } from '@angular/forms';
import { FormGroupControls, FormControlState, Validator } from './types';

export function mapFormControls<T extends FormGroupControls, R>(
    controls: T,
    mapFunc: (control: FormControlState<any>, key: string) => R
): {
    [key: string]: R;
} {
    return Object.entries(controls)
        .map(([key, control]) => ({
            [key]: mapFunc(control, key),
        }))
        .reduce((ctrl1, ctrl2) => ({ ...ctrl1, ...ctrl2 }), {});
}

export function of<T>(fn: ValidatorFn): Validator<T> {
    return (control: FormControlState<T>) =>
        fn({
            value: control.value,
        } as AbstractControl);
}
