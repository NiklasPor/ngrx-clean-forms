import {
    FormControlErrors,
    FormControlState,
    FormGroupState,
    FormGroupSummary,
    FormControlSummary,
    FormGroupControlSummaries,
    FormGroupErrors,
    FormGroupControls,
} from './types';
import { mapFormControls } from './utils';

export function getFormControlErrors<T>(control: FormControlState<T>): FormControlErrors | null {
    const errors = control.validators
        .map(validator => validator(control))
        .filter(error => error !== null)
        .reduce((err1, err2) => ({ ...err1, ...err2 }), {});

    return Object.keys(errors).length ? errors : null;
}

export function getFormGroupErrors(group: FormGroupState): FormGroupErrors | null {
    const errors = mapFormControls(group.controls, control => getFormControlErrors(control));
    return Object.keys(errors).length ? errors : null;
}

export function getFormControlSummary<T>(control: FormControlState<T>): FormControlSummary<T> {
    const errors = getFormControlErrors(control);

    return {
        ...control,
        errors,
        valid: errors === null,
    };
}

export function getFormGroupControlSummaries(
    controls: FormGroupControls
): FormGroupControlSummaries {
    return mapFormControls(controls, control => getFormControlSummary(control));
}

export function getFormGroupSummary(group: FormGroupState): FormGroupSummary {
    return {
        controls: getFormGroupControlSummaries(group.controls),
        errors: getFormGroupErrors(group),
        pristine: group.pristine,
    };
}
