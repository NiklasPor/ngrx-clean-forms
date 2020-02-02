import {
    FormControls,
    FormControlState,
    FormControlUpdate,
    FormGroupState,
    FormGroupUpdate,
    FormArrayState,
    FormArrayUpdate,
} from './types';
import { mapFormControlUpdates } from './utils';

/**
 * Returns a `FormControlState` which represents the input state with the applied update.
 * The returned value is a new constructed object, except when the update is invalid.
 *
 * @param control The `FormControlState` which the update will be applied to.
 * @param update The `FormControlUpdate` itself.
 */
export function reduceFormControl<T>(
    control: FormControlState<T>,
    update: FormControlUpdate<T>
): FormControlState<T> {
    if (!update) {
        return control;
    }

    return {
        ...control,
        ...update,
    };
}

/**
 * Returns a `FormGroupState` which represents the input state with the applied update.
 * The returned value is a new constructed object, except when the update is invalid.
 *
 * @param control The `FormGroupState` which the update will be applied to.
 * @param update The `FormGroupUpdate` itself.
 */
export function reduceFormGroup<TControls extends FormControls>(
    group: FormGroupState<TControls>,
    update: FormGroupUpdate<TControls>
): FormGroupState<TControls> {
    if (!update) {
        return group;
    }

    return {
        ...group,
        ...update,
        controls: {
            ...group.controls,
            ...(update.controls
                ? mapFormControlUpdates(update.controls, (control, key) => ({
                      ...group.controls[key],
                      ...control,
                  }))
                : {}),
        },
    };
}

/**
 * Returns a `FormArrayState` which represents the input state with the applied update.
 * The returned value is a new constructed object, except when the update is invalid.
 *
 * @param control The `FormArrayState` which the update will be applied to.
 * @param update The `FormArrayUpdate` itself. Invalid values and empty objects inside the `update.controls` array will be ignored.
 */
export function reduceFormArray<T>(
    group: FormArrayState<T>,
    update: FormArrayUpdate<T>
): FormArrayState<T> {
    if (!update) {
        return group;
    }

    return {
        ...group,
        ...update,
        controls: group.controls.map((control, index) =>
            update && update.controls ? reduceFormControl(control, update.controls[index]) : control
        ),
    };
}
