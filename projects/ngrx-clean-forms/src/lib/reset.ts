import {
    FormControlState,
    FormControls,
    FormGroupState,
    FormControlInitTuple,
    FormArrayState,
} from './types';
import { initFormControl, initFormGroup, initFormArray } from './init';
import { mapFormGroupControlStates } from './utils';

/**
 * Resets a control back to the default values.
 * The following values will stay the same after the reset:
 * - `initialValue`
 * - `validators`
 *
 * @param control The `FormControlState` which should be used to create the reset.
 * @param initialValue Optional parameter for passing a new initial value.
 */
export function resetFormControl<T>(
    control: FormControlState<T>,
    initialValue = control.initialValue
): FormControlState<T> {
    return initFormControl([initialValue, control.validators]);
}

/**
 * Resets a group back to its default values.
 * Internally calls `resetFormControl` for every control.
 *
 * @see `resetFormControl`
 *
 * @param group The `FormGroupState` which should be used to create the reset.
 */
export function resetFormGroup<TControls extends FormControls>(
    group: FormGroupState<TControls>
): FormGroupState<TControls> {
    const initTuple = mapFormGroupControlStates(
        group.controls,
        ({ initialValue, validators }): FormControlInitTuple<any> => [initialValue, validators]
    );

    return initFormGroup(initTuple);
}

/**
 * Resets an array back to its default values.
 * Internally calls `resetFormControl` for every control.
 *
 * @see `resetFormControl`
 *
 * @param array The `FormArrayState` which should be used to create the reset.
 */
export function resetFormArray<T>(array: FormArrayState<T>): FormArrayState<T> {
    const initTuple = array.controls.map(
        ({ initialValue, validators }): FormControlInitTuple<any> => [initialValue, validators]
    );

    return initFormArray(initTuple);
}
