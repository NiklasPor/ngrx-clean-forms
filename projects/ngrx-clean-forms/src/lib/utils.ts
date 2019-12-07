import { AbstractControl, ValidatorFn, ValidationErrors } from '@angular/forms';
import { FormGroupControls, FormControlState, Validator, FormControls } from './types';

export function mapFormControls<TControls extends FormControls, R>(
    controls: FormGroupControls<TControls> | Partial<FormGroupControls<TControls>>,
    mapFunc: (control: FormControlState<any>, key: string) => R
): {
    [K in keyof TControls]: R;
} {
    const result = Object.entries(controls)
        .map(([key, control]) => ({
            [key]: mapFunc(control as FormControlState<any>, key),
        }))
        .reduce((ctrl1, ctrl2) => ({ ...ctrl1, ...ctrl2 }), {});

    return result as {
        [K in keyof TControls]: R;
    };
}

export function validatorOf<T>(fn: ValidatorFn): Validator<T> {
    return (control: FormControlState<T>) =>
        fn({
            value: control.value,
            dirty: !control.pristine,
            pristine: control.pristine,
            touched: !control.untouched,
            untouched: control.untouched,
        } as AbstractControl);
}
