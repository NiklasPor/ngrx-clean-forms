import {
    Validator,
    FormControlState,
    FormControls,
    FormGroupInitialize,
    FormGroupState,
    FormGroupControlStates,
} from './types';

export function initFormControl<T>(
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

export function initFormGroup<TControls extends FormControls>(
    controls: FormGroupInitialize<TControls>
): FormGroupState<TControls> {
    return {
        controls: Object.entries(controls)
            .map(([key, [initialValue, validators]]) => ({
                [key]: initFormControl(initialValue, validators),
            }))
            .reduce((ctrl1, ctrl2) => ({ ...ctrl1, ...ctrl2 }), {}) as FormGroupControlStates<
            TControls
        >,
    };
}
