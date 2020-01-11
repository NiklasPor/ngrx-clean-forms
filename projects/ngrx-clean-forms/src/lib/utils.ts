import { AbstractControl, ValidatorFn } from '@angular/forms';
import {
    FormControls,
    FormControlState,
    FormControlSummary,
    FormControlUpdate,
    FormGroupControlStates,
    FormGroupControlSummaries,
    FormGroupControlUpdates,
    Validator,
} from './types';

export function mapFormControlStates<TControls extends FormControls, R>(
    controls: FormGroupControlStates<TControls>,
    mapFunc: (control: FormControlState<any>, key: string) => R
): {
    [K in keyof TControls]: R;
} {
    return mapFormControls<TControls, R>(controls, mapFunc);
}

export function mapFormControlSummaries<TControls extends FormControls, R>(
    controls: FormGroupControlSummaries<TControls>,
    mapFunc: (control: FormControlSummary<any>, key: string) => R
): {
    [K in keyof TControls]: R;
} {
    return mapFormControls<TControls, R>(controls, mapFunc);
}

export function mapFormControlUpdates<TControls extends FormControls, R>(
    controls: FormGroupControlUpdates<TControls>,
    mapFunc: (control: FormControlUpdate<any>, key: string) => R
): {
    [K in keyof TControls]: R;
} {
    return mapFormControls<TControls, R>(controls, mapFunc);
}

export function mapFormControls<TControls extends FormControls, R>(
    controls: {},
    mapFunc: (control: {}, key: string) => R
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

export function validatorOf<T>(fn: ValidatorFn): Validator<T> {
    return (control: FormControlState<T>) =>
        fn({
            value: control.value,
            dirty: !control.pristine,
            pristine: control.pristine,
            touched: !control.untouched,
            untouched: control.untouched,
            enabled: !control.disabled,
            disabled: control.disabled,
        } as AbstractControl);
}
