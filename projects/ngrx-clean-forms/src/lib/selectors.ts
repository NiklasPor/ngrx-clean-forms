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
    FormArraySummary,
    FormArrayErrors,
    FormArrayControlSummaries,
    FormArrayState,
} from './types';
import { mapFormControlStates, mapFormControlSummaries } from './utils';

export function getFormControlErrors<T>(control: FormControlState<T>): FormControlErrors[] {
    return control.validators.map(validator => validator(control));
}

export function getFormGroupErrors<TControls extends FormControls>(
    summaries: FormGroupControlSummaries<TControls>
): FormGroupErrors<TControls> | null {
    const errors = mapFormControlSummaries(summaries, summary => summary.errors);

    Object.entries(errors)
        .filter(([_, value]) => value === null)
        .forEach(([key, _]) => delete errors[key]);

    return Object.keys(errors).length ? errors : null;
}

export function getFormArrayErrors<T>(
    summaries: FormArrayControlSummaries<T>
): FormArrayErrors | null {
    const errors = summaries.map(summary => summary.errors);

    return errors.filter(Boolean).length ? errors : null;
}

export function getFormControlSummary<T>(
    control: FormControlState<T>,
    ...additionalErrors: FormControlErrors[]
): FormControlSummary<T> {
    const errors = mergeFormControlErrors(...getFormControlErrors(control), ...additionalErrors);

    return {
        ...control,
        errors,
        valid: errors === null,
    };
}

export function getFormGroupControlSummaries<TControls extends FormControls>(
    controls: FormGroupControlStates<TControls>,
    ...additionalErrors: FormGroupErrors<TControls>[]
): FormGroupControlSummaries<TControls> {
    const additionalError = mergeFormGroupErrors(...additionalErrors);

    return mapFormControlStates(controls, (control, key) =>
        getFormControlSummary(control, additionalError ? additionalError[key] : null)
    );
}

export function getFormArrayControlSummaries<T>(
    controls: FormControlState<T>[],
    ...additionalErrors: FormArrayErrors[]
): FormControlSummary<T>[] {
    const additionalError = mergeFormArrayErrors(...additionalErrors);

    return controls.map((control, i) =>
        getFormControlSummary(control, additionalError ? additionalError[i] : null)
    );
}

export function getFormGroupPristine<TControls extends FormControls>(
    group: FormGroupState<TControls>
): boolean {
    return Object.values(group.controls).every(control => control.pristine);
}

export function getFormArrayPristine<T>(array: FormArrayState<T>): boolean {
    return array.controls.every(control => control.pristine);
}

export function getFormGroupUntouched<TControls extends FormControls>(
    group: FormGroupState<TControls>
): boolean {
    return Object.values(group.controls).every(control => control.untouched);
}

export function getFormArrayUntouched<T>(array: FormArrayState<T>): boolean {
    return array.controls.every(control => control.untouched);
}

export function getFormGroupSummary<TControls extends FormControls>(
    group: FormGroupState<TControls>,
    ...additionalErrors: FormGroupErrors<TControls>[]
): FormGroupSummary<TControls> {
    const summaries = getFormGroupControlSummaries(group.controls, ...additionalErrors);
    const errors = getFormGroupErrors(summaries);

    return {
        controls: summaries,
        pristine: getFormGroupPristine(group),
        untouched: getFormGroupUntouched(group),
        errors,
        valid: errors === null,
    };
}

export function getFormArraySummary<T>(
    array: FormArrayState<T>,
    ...additionalErrors: FormArrayErrors[]
): FormArraySummary<T> {
    const summaries = getFormArrayControlSummaries(array.controls, ...additionalErrors);
    const errors = getFormArrayErrors(summaries);

    return {
        controls: summaries,
        pristine: getFormArrayPristine(array),
        untouched: getFormArrayUntouched(array),
        errors,
        valid: errors === null,
    };
}

export function mergeFormControlErrors(...errors: FormControlErrors[]): FormControlErrors | null {
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
): FormGroupErrors<TControls> | null {
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

export function mergeFormArrayErrors(...errors: FormArrayErrors[]): FormArrayErrors | null {
    const mergedErrors = errors
        .filter(Boolean)
        .reduce((arr1, arr2) => (arr1.length >= arr2.length ? arr1 : arr2), [])
        .map((_, i) => mergeFormControlErrors(...errors.map(arrayErrors => arrayErrors[i])));

    return mergedErrors.filter(Boolean).length > 0 ? mergedErrors : null;
}
