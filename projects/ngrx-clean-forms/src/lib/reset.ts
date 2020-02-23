import {
    FormControlState,
    FormControls,
    FormGroupState,
    FormControlInitTuple,
    FormArrayState,
} from './types';
import { initFormControl, initFormGroup, initFormArray } from './init';
import { mapFormGroupControlStates } from './utils';

export function resetFormControl<T>(
    control: FormControlState<T>,
    initialValue = control.initialValue
): FormControlState<T> {
    return initFormControl([initialValue, control.validators]);
}

export function resetFormGroup<TControls extends FormControls>(
    group: FormGroupState<TControls>
): FormGroupState<TControls> {
    const initTuple = mapFormGroupControlStates(
        group.controls,
        ({ initialValue, validators }): FormControlInitTuple<any> => [initialValue, validators]
    );

    return initFormGroup(initTuple);
}

export function resetFormArray<T>(array: FormArrayState<T>): FormArrayState<T> {
    const initTuple = array.controls.map(
        ({ initialValue, validators }): FormControlInitTuple<any> => [initialValue, validators]
    );

    return initFormArray(initTuple);
}
