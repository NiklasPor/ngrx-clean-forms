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
