import { reduceFormControl } from './reducer';
import {
    FormControlInitializeTuple,
    FormControlInitialUpdate,
    FormControls,
    FormControlState,
    FormGroupControlStates,
    FormGroupInitialize,
    FormGroupState,
} from './types';

export function initFormControl<T>(
    initial: FormControlInitializeTuple<T> | FormControlInitialUpdate<T>
): FormControlState<T> {
    return Array.isArray(initial)
        ? initFormControlFromTuple(initial)
        : initFormControlFromUpdate(initial);
}

export function initFormGroup<TControls extends FormControls>(
    controls: FormGroupInitialize<TControls>
): FormGroupState<TControls> {
    return {
        controls: Object.entries(controls)
            .map(([key, initial]) => ({
                [key]: initFormControl(initial),
            }))
            .reduce((ctrl1, ctrl2) => ({ ...ctrl1, ...ctrl2 }), {}) as FormGroupControlStates<
            TControls
        >,
    };
}

function initFormControlFromTuple<T>([value, validators]: FormControlInitializeTuple<
    T
>): FormControlState<T> {
    validators = validators || [];
    return initFormControlFromUpdate({ value, validators });
}

function initFormControlFromUpdate<T = any>(
    initialUpdate: FormControlInitialUpdate<T>
): FormControlState<T> {
    return reduceFormControl(
        {
            value: undefined,
            pristine: true,
            untouched: true,
            disabled: false,
            validators: [],
        },
        initialUpdate
    );
}
