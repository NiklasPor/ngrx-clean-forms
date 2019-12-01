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
    if (!Object.keys(control).length) {
        return control;
    }

    return {
        ...control,
        ...update,
    };
}

export function reduceFormGroup<T extends FormGroupState>(group: T, update: FormGroupUpdate): T {
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
    validators?: Validator<T>[]
): FormControlState<T> {
    return {
        value: initialValue,
        pristine: true,
        touched: false,
        validators: validators || [],
    };
}

export function initialFormGroup<T extends FormGroupControls>(controls: T): FormGroupState<T> {
    return {
        pristine: true,
        controls,
    };
}
