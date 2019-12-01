import {
    FormControlState,
    FormControlUpdate,
    FormGroupState,
    FormGroupUpdate,
    Validator,
    FormGroupControls,
} from './types';

export function reduceFormControl<T>(
    control: FormControlState<T>,
    update: FormControlUpdate<T>
): FormControlState<T> {
    if (!control.validators && !control.value) {
        return control;
    }

    return {
        ...control,
        ...update,
    };
}

export function reduceFormGroup<T>(group: FormGroupState, update: FormGroupUpdate) {
    return {
        ...group,
        ...update,
        controls: {
            ...group.controls,
            ...(update.controls || {}),
        },
    };
}

export function initialFormControl<T>(
    initialValue: T,
    validators: Validator<T>[]
): FormControlState<T> {
    return {
        value: initialValue,
        pristine: true,
        validators,
    };
}

export function initialFormGroup(controls: FormGroupControls): FormGroupState {
    return {
        pristine: true,
        controls,
    };
}
