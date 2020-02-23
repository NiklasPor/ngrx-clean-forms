import { initFormControl } from './init';
import { reduceFormArray, reduceFormGroup } from './reducer';
import { FormArrayState, FormControls, FormControlState, FormGroupState } from './types';
import { mapFormGroupControlStates } from './utils';

/**
 * Resets a control back to the default values.
 * The following values will be ignored and stay the same:
 * - `initialValue`
 * - `validators`
 * - `disabled`
 *
 * @param control The `FormControlState` which should be used to create the reset.
 * @param initialValue Optional parameter for passing a new initial value.
 */
export function resetFormControl<T>(
    control: FormControlState<T>,
    initialValue = control.initialValue
): FormControlState<T> {
    return initFormControl([initialValue, control.validators, control.disabled]);
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
    const controls = mapFormGroupControlStates(group.controls, control =>
        resetFormControl(control)
    );

    return reduceFormGroup(group, { controls });
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
    const controls = array.controls.map(control => resetFormControl(control));

    return reduceFormArray(array, { controls });
}
