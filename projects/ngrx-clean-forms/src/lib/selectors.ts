import {
    FormControlErrors,
    FormControls,
    FormControlState,
    FormControlSummary,
    FormGroupControlStates,
    FormGroupControlSummaries,
    FormGroupErrors,
    FormGroupState,
    FormGroupSummary,
} from './types';
import { mapFormControlStates, mapFormControlSummaries } from './utils';

export function getFormControlErrors<T>(control: FormControlState<T>): FormControlErrors | null {
    const errors = control.validators
        .map(validator => validator(control))
        .filter(error => error !== null)
        .reduce((err1, err2) => ({ ...err1, ...err2 }), {});

    return Object.keys(errors).length ? errors : null;
}

export function getFormGroupErrors<TControls extends FormControls>(
    group: FormGroupState<TControls>
): FormGroupErrors<TControls> | null {
    const errors = mapFormControlStates(group.controls, control => getFormControlErrors(control));

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

export function getFormGroupControlSummaries<TControls extends FormControls>(
    controls: FormGroupControlStates<TControls>
): FormGroupControlSummaries<TControls> {
    return mapFormControlStates(controls, control => getFormControlSummary(control));
}

export function getFormGroupPristine<TControls extends FormControls>(
    group: FormGroupState<TControls>
): boolean {
    return Object.values(group.controls).every(control => control.pristine);
}

export function getFormGroupUntouched<TControls extends FormControls>(
    group: FormGroupState<TControls>
): boolean {
    return Object.values(group.controls).every(control => control.untouched);
}

export function getFormGroupSummary<TControls extends FormControls>(
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

export function getFormGroupSummaryWithErrors<TControls extends FormControls>(
    group: FormGroupState<TControls>,
    ...additionalErrors: FormGroupErrors<TControls>[]
): FormGroupSummary<TControls> {
    const summary = getFormGroupSummary(group);

    const errors = mergeFormGroupErrors(summary.errors, ...additionalErrors);

    const controls = mapFormControlSummaries(summary.controls, (control, key) => {
        const controlErrors = mergeFormControlErrors(control.errors, errors[key]);

        return {
            ...control,
            errors: controlErrors,
            valid: controlErrors === null,
        };
    });

    return {
        ...summary,
        controls,
        errors,
        valid: errors === null,
    };
}

export function mergeFormControlErrors(...errors: FormControlErrors[]) {
    return errors.reduce((e1, e2) => {
        if (!e1 && !e2) {
            return null;
        }

        if (!e1) {
            return e2;
        }

        if (!e2) {
            return e1;
        }

        return {
            ...e1,
            ...e2,
        };
    }, null);
}

export function mergeFormGroupErrors<TControls extends FormControls>(
    ...errors: FormGroupErrors<TControls>[]
): FormGroupErrors<TControls> {
    return errors.reduce((group1, group2) => {
        if (!group1 && !group2) {
            return null;
        }

        if (!group1) {
            return group2;
        }

        if (!group2) {
            return group1;
        }

        return {
            ...group1,
            ...group2,
            ...Object.keys(group1)
                .filter(key1 => Object.keys(group2).find(key2 => key1 === key2))
                .map(key => ({
                    [key]: mergeFormControlErrors(group1[key], group2[key]),
                }))
                .reduce(
                    (e1, e2) => ({
                        ...e1,
                        ...e2,
                    }),
                    {}
                ),
        };
    }, null);
}
