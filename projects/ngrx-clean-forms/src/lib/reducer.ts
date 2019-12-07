import {
    FormControlState,
    FormControlUpdate,
    FormGroupState,
    FormGroupUpdate,
    Validator,
    FormGroupControlStates,
    FormControls,
    FormGroupInitialize,
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

export function initialFormControl<T>(
    initialValue: T,
    validators?: Validator<T>[]
): FormControlState<T> {
    return {
        value: initialValue,
        pristine: true,
        untouched: true,
        validators: validators || [],
    };
}

export function initialFormGroup<TControls extends FormControls>(
    controls: FormGroupInitialize<TControls>
): FormGroupState<TControls> {
    return {
        controls: Object.entries(controls)
            .map(([key, [initialValue, validators]]) => ({
                [key]: initialFormControl(initialValue, validators),
            }))
            .reduce((ctrl1, ctrl2) => ({ ...ctrl1, ...ctrl2 }), {}) as FormGroupControlStates<
            TControls
        >,
    };
}
