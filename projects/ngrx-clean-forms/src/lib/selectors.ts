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
import {
    mapFormControlStates,
    mapFormControlSummaries,
    mergeFormGroupErrors,
    mergeFormControlErrors,
    mergeFormArrayErrors,
} from './utils';

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

/**
 * Creates a `FormControlSummary` from the given `FormControlState`.
 * It is possible to add additional errors.
 *
 * @param control The `FormControlState` which is used to create the `FormControlSummary`.
 * @param additionalErrors An array of `FormControlErrors` which will be merged into the errors of the control.
 */
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

export function getFormArrayKeys<T>(array: FormArrayState<T>): number[] {
    return array.controls.map((_, i) => i);
}

/**
 * Creates a `FormGroupSummary` from the given `FormGroupState`.
 * It is possible to add additional errors.
 *
 * @param group The input `FormGroupState`. Used to create the `FormGroupSummary`.
 * @param additionalErrors An array of additional `FormGroupErrors`, which will be merged into the errors of the group and of each control.
 */
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

/**
 * Creates a `FormArraySummary` from the given `FormArrayState`.
 * It is possible to add additional errors.
 *
 * @param array The input `FormArrayState`. Used to create the `FormArraySummary`.
 * @param additionalErrors An array of additional `FormArrayErrors`, which will be merged into the errors of the array and of each control.
 */
export function getFormArraySummary<T>(
    array: FormArrayState<T>,
    ...additionalErrors: FormArrayErrors[]
): FormArraySummary<T> {
    const summaries = getFormArrayControlSummaries(array.controls, ...additionalErrors);
    const errors = getFormArrayErrors(summaries);

    return {
        controls: summaries,
        keys: getFormArrayKeys(array),
        pristine: getFormArrayPristine(array),
        untouched: getFormArrayUntouched(array),
        errors,
        valid: errors === null,
    };
}
