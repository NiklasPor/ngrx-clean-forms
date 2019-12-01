import { FormControlError, FormControl, FormGroup, FormGroupErrors } from './types';

export function getFormControlErrors<T>(control: FormControl<T>): FormControlError | null {
    const errors = control.validators
        .map(validator => validator(control))
        .filter(error => error !== null)
        .reduce((err1, err2) => ({ ...err1, ...err2 }));

    return Object.keys(errors).length ? errors : null;
}

export function getFormGroupErrors(group: FormGroup): FormGroupErrors {
    const errors = Object.entries(group)
        .map(([key, control]) => ({ [key]: getFormControlErrors(control) }))
        .reduce((grp1, grp2) => ({ ...grp1, ...grp2 }));

    return Object.keys(errors).length ? errors : null;
}
