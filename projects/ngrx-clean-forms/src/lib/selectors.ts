import {
    FormControlErrors,
    FormControlState,
    FormGroupState,
    FormGroupSummary,
    FormControlSummary,
    FormGroupErrors,
    FormGroupControls,
    FormGroupControlSummaries,
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

    Object.entries(errors)
        .filter(([_, value]) => value === null)
        .forEach(([key, _]) => delete errors[key]);

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

export function getFormGroupControlSummaries<TControls extends FormGroupControls>(
    controls: TControls
): FormGroupControlSummaries<TControls> {
    return mapFormControls(controls, control => getFormControlSummary(control));
}

export function getFormGroupPristine(group: FormGroupState): boolean {
    return Object.values(group.controls)
        .map(control => control.pristine)
        .reduce((val1, val2) => val1 && val2);
}

export function getFormGroupUntouched(group: FormGroupState): boolean {
    return Object.values(group.controls)
        .map(control => control.untouched)
        .reduce((val1, val2) => val1 && val2);
}

export function getFormGroupSummary<TControls extends FormGroupControls>(
    group: FormGroupState<TControls>
): FormGroupSummary<TControls> {
    const errors = getFormGroupErrors(group);

    return {
        controls: getFormGroupControlSummaries(group.controls),
        pristine: getFormGroupPristine(group),
        untouched: getFormGroupUntouched(group),
        errors,
        valid: errors === null,
    };
}
