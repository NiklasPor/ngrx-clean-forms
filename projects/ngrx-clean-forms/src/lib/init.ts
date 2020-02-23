import { reduceFormControl } from './reducer';
import {
    FormControlInitTuple,
    FormControlInitUpdate,
    FormControls,
    FormControlState,
    FormGroupControlStates,
    FormGroupInit,
    FormGroupState,
    FormArrayInit,
    FormArrayState,
    FormControlInit,
} from './types';

/**
 * Initializes a new `FormControlState`.
 * @see `FormControlInit`
 *
 * @example
 * initFormControl(['value', [validator]])
 * initFormControl({value: 'value', validators: [validator], disabled: true, ...})
 */
export function initFormControl<T>(initial: FormControlInit<T>): FormControlState<T> {
    return Array.isArray(initial)
        ? initFormControlFromTuple(initial)
        : initFormControlFromUpdate(initial);
}

/**
 * Initializes a new `FormGroupState`.
 * @param controls An object containing control initializations.
 * @see `FormGroupInit`
 *
 * @example
 * initFormGroup({
 *  firstControl: ['firstValue', [validator]],
 *  secondControl: {value: 'value', validators: [validator], disabled: true, ...}
 * })
 */
export function initFormGroup<TControls extends FormControls>(
    controls: FormGroupInit<TControls>
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

/**
 * Initializes a new `FormArrayState`.
 * @param controls An object containing control initializations.
 * @see `FormArrayInit`
 *
 * @example
 * initFormArray([
 *  ['firstValue', [validator]],
 *  {value: 'value', validators: [validator], disabled: true, ...}
 * ])
 */
export function initFormArray<T>(initial: FormArrayInit<T>): FormArrayState<T> {
    return {
        controls: initial.map(init => initFormControl(init)),
    };
}

function initFormControlFromTuple<T>([
    value,
    validators = [],
    disabled = false,
]: FormControlInitTuple<T>): FormControlState<T> {
    return initFormControlFromUpdate({ value, validators, disabled });
}

function initFormControlFromUpdate<T = any>(
    initialUpdate: FormControlInitUpdate<T>
): FormControlState<T> {
    return reduceFormControl(
        {
            value: undefined,
            initialValue: initialUpdate.value,
            pristine: true,
            untouched: true,
            disabled: false,
            validators: [],
        },
        initialUpdate
    );
}
