import {
    FormArrayControlSummaries,
    FormArrayErrors,
    FormArrayState,
    FormArraySummary,
    FormControlErrors,
    FormControlState,
    FormControlSummary,
    FormControls,
    FormGroupControlStates,
    FormGroupControlSummaries,
    FormGroupErrors,
    FormGroupState,
    FormGroupSummary,
} from './types';
import {
    mapFormGroupControlStates,
    mapFormGroupControlSummaries,
    mergeFormArrayErrors,
    mergeFormControlErrors,
    mergeFormGroupErrors,
} from './utils';

import { circularDeepEqual } from 'fast-equals';

export function getFormControlErrors<T>(control: FormControlState<T>): FormControlErrors[] {
    return control.validators.map(validator => validator(control));
}

export function getFormGroupControlSummariesErrors<TControls extends FormControls>(
    summaries: FormGroupControlSummaries<TControls>
): FormGroupErrors<TControls> | null {
    const errors = mapFormGroupControlSummaries(summaries, summary => summary.errors);

    Object.entries(errors)
        .filter(([_, value]) => value === null)
        .forEach(([key, _]) => delete errors[key]);

    return Object.keys(errors).length ? errors : null;
}

export function getFormArrayControlSummariesErrors<T>(
    summaries: FormArrayControlSummaries<T>
): FormArrayErrors | null {
    const errors = summaries.map(summary => summary.errors);

    return errors.filter(Boolean).length ? errors : null;
}

export function getFormGroupErrors<TControls extends FormControls>(
    group: FormGroupState<TControls>
): FormGroupErrors<TControls> | null {
    return mergeFormGroupErrors(...group.validators.map(validator => validator(group)));
}

export function getFormArrayErrors<T>(array: FormArrayState<T>): FormArrayErrors | null {
    return mergeFormArrayErrors(...array.validators.map(validator => validator(array)));
}

export function getFormControlChanged<T>(control: FormControlState<T>): boolean {
    return !circularDeepEqual(control.value, control.initialValue);
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
        changed: getFormControlChanged(control),
    };
}

export function getFormGroupControlSummaries<TControls extends FormControls>(
    controls: FormGroupControlStates<TControls>,
    ...additionalErrors: FormGroupErrors<TControls>[]
): FormGroupControlSummaries<TControls> {
    const additionalError = mergeFormGroupErrors(...additionalErrors);

    return mapFormGroupControlStates(controls, (control, key) =>
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

export function getFormGroupChanged<TControls extends FormControls>(
    controls: FormGroupControlSummaries<TControls>
): boolean {
    return Object.values(controls).some(control => control.changed);
}

export function getFormArrayChanged<T>(controls: FormArrayControlSummaries<T>): boolean {
    return controls.some(control => control.changed);
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
    const groupErrors = getFormGroupErrors(group);
    const summaries = getFormGroupControlSummaries(
        group.controls,
        groupErrors,
        ...additionalErrors
    );
    const errors = getFormGroupControlSummariesErrors(summaries);

    return {
        controls: summaries,
        pristine: getFormGroupPristine(group),
        untouched: getFormGroupUntouched(group),
        errors,
        valid: errors === null,
        changed: getFormGroupChanged(summaries),
        validators: group.validators,
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
    const arrayErrors = getFormArrayErrors(array);
    const summaries = getFormArrayControlSummaries(
        array.controls,
        arrayErrors,
        ...additionalErrors
    );
    const errors = getFormArrayControlSummariesErrors(summaries);

    return {
        controls: summaries,
        keys: getFormArrayKeys(array),
        pristine: getFormArrayPristine(array),
        untouched: getFormArrayUntouched(array),
        errors,
        valid: errors === null,
        changed: getFormArrayChanged(summaries),
        validators: array.validators,
    };
}
