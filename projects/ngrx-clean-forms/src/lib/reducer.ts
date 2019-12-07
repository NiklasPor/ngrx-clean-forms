import {
    FormControls,
    FormControlState,
    FormControlUpdate,
    FormGroupState,
    FormGroupUpdate,
} from './types';
import { mapFormControlStates } from './utils';

export function reduceFormControl<T>(
    control: FormControlState<T>,
    update: FormControlUpdate<T>
): FormControlState<T> {
    return {
        ...control,
        ...update,
    };
}

export function reduceFormGroup<TControls extends FormControls>(
    group: FormGroupState<TControls>,
    update: FormGroupUpdate<TControls>
): FormGroupState<TControls> {
    return {
        ...group,
        ...update,
        controls: {
            ...group.controls,
            ...mapFormControlStates(update.controls, (control, key) => ({
                ...group.controls[key],
                ...control,
            })),
        },
    };
}
