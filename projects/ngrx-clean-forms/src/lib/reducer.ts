import {
    FormControlState,
    FormControlUpdate,
    FormGroupState,
    FormGroupUpdate,
    Validator,
    FormGroupControls,
} from './types';
import { mapFormControls } from './utils';

export function reduceFormControl<T>(
    control: FormControlState<T>,
    update: FormControlUpdate<T>
): FormControlState<T> {
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
            ...mapFormControls(update.controls, (control, key) => ({
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
