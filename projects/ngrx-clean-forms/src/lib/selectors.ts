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

export function getFormControlErrors<T>(control: FormControlState<T>): FormControlErrors | null {
    const errors = control.validators
        .map(validator => validator(control))
        .filter(error => error !== null)
        .reduce((err1, err2) => ({ ...err1, ...err2 }), {});

    return Object.keys(errors).length ? errors : null;
}

export function getFormGroupErrors(group: FormGroupState): FormGroupErrors {
    const errors = Object.entries(group.controls)
        .map(([key, control]) => ({ [key]: getFormControlErrors(control) }))
        .reduce((grp1, grp2) => ({ ...grp1, ...grp2 }), {});

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
    return Object.entries(controls)
        .map(([key, control]) => ({ [key]: getFormControlSummary(control) }))
        .reduce((grp1, grp2) => ({ ...grp1, ...grp2 }));
}

export function getFormGroupSummary(group: FormGroupState): FormGroupSummary {
    return {
        controls: getFormGroupControlSummaries(group.controls),
        errors: getFormGroupErrors(group),
        pristine: group.pristine,
    };
}
