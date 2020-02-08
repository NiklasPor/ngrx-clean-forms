import { AbstractControl, ValidatorFn, Validators } from '@angular/forms';
import {
    FormControls,
    FormControlState,
    FormControlSummary,
    FormControlUpdate,
    FormGroupControlStates,
    FormGroupControlSummaries,
    FormGroupControlUpdates,
    Validator,
    FormGroupErrors,
    FormArrayErrors,
    FormControlErrors,
} from './types';

/**
 * Maps an object of control states to a value given by the `mapFunc`.
 *
 * @param controls Object which contains keys and associated control update.
 * @param mapFunc Mapper function to convert the update.
 *
 * @example
 * // Mapping of:
 * const controls = {
 *  firstControl: {
 *    value: 'firstValue',
 *    ...
 *  },
 *  secondControl: {
 *    value: 'secondValue',
 *    ...
 *  },
 * }
 *
 * // With the function:
 * const mapFunc = (control) => control.value
 *
 * // Will result in:
 * const result = {
 *  firstControl: 'firstValue',
 *  secondControl: 'secondValue'
 * }
 */
export function mapFormGroupControlStates<TControls extends FormControls, R>(
    controls: FormGroupControlStates<TControls>,
    mapFunc: (control: FormControlState<any>, key: string) => R
): {
    [K in keyof TControls]: R;
} {
    return mapFormControls<TControls, R>(controls, mapFunc);
}

/**
 * Maps an object of control summaries to a value given by the `mapFunc`.
 *
 * @param controls Object which contains keys and associated control summaries.
 * @param mapFunc Mapper function to convert the update.
 *
 * @example
 * // Mapping of:
 * const controls = {
 *  firstControl: {
 *    value: 'firstValue',
 *    ...
 *  },
 *  secondControl: {
 *    value: 'secondValue',
 *    ...
 *  },
 * }
 *
 * // With the function:
 * const mapFunc = (control) => control.value
 *
 * // Will result in:
 * const result = {
 *  firstControl: 'firstValue',
 *  secondControl: 'secondValue'
 * }
 */
export function mapFormGroupControlSummaries<TControls extends FormControls, R>(
    controls: FormGroupControlSummaries<TControls>,
    mapFunc: (control: FormControlSummary<any>, key: string) => R
): {
    [K in keyof TControls]: R;
} {
    return mapFormControls<TControls, R>(controls, mapFunc);
}

/**
 * Maps an object of control updates to a value given by the `mapFunc`.
 *
 * @param controls Object which contains keys and associated control updates.
 * @param mapFunc Mapper function to convert the update.
 *
 * @example
 * // Mapping of:
 * const controls = {
 *  firstControl: {
 *    value: 'firstValue',
 *    ...
 *  },
 *  secondControl: {
 *    value: 'secondValue',
 *    ...
 *  },
 * }
 *
 * // With the function:
 * const mapFunc = (control) => control.value
 *
 * // Will result in:
 * const result = {
 *  firstControl: 'firstValue',
 *  secondControl: 'secondValue'
 * }
 */
export function mapFormGroupControlUpdates<TControls extends FormControls, R>(
    controls: FormGroupControlUpdates<TControls>,
    mapFunc: (control: FormControlUpdate<any>, key: string) => R
): {
    [K in keyof TControls]: R;
} {
    return mapFormControls<TControls, R>(controls, mapFunc);
}

export function mapFormControls<TControls extends FormControls, R>(
    controls: {},
    mapFunc: (control: {}, key: string) => R
): {
    [K in keyof TControls]: R;
} {
    const result = Object.entries(controls)
        .map(([key, control]) => ({
            [key]: mapFunc(control, key),
        }))
        .reduce((ctrl1, ctrl2) => ({ ...ctrl1, ...ctrl2 }), {});

    return result as {
        [K in keyof TControls]: R;
    };
}

/**
 * Converts an Angular validator for the usage with this framework.
 * Does **not** support asynchronous validators.
 *
 * Only a subset of properties is available for the Angular validators:
 * `value, dirty, pristine, touched, untouched, enabled, disabled`
 * @param fn Angular validator function..
 */
export function validatorOf<T>(fn: ValidatorFn): Validator<T> {
    return (control: FormControlState<T>) =>
        fn({
            value: control.value,
            dirty: !control.pristine,
            pristine: control.pristine,
            touched: !control.untouched,
            untouched: control.untouched,
            enabled: !control.disabled,
            disabled: control.disabled,
        } as AbstractControl);
}

/**
 * Merges an array of `FormControlErrors`.
 * Returns null if all errors are null.
 * @param errors An array of `FormControlErrors` which will be merged into a single `FormControlErrors` value.
 */
export function mergeFormControlErrors(...errors: FormControlErrors[]): FormControlErrors | null {
    return errors.reduce((e1, e2) => {
        if (!e1 && !e2) {
            return null;
        }

        if (!e1) {
            return e2;
        }

        if (!e2) {
            return e1;
        }

        return {
            ...e1,
            ...e2,
        };
    }, null);
}

/**
 * Merges an array of errors.
 * The different child control errors will also be merged.
 * Returns null if all errors are null.
 * @param errors Multiple errors to be merged.
 *
 * @example
 * // Merge of:
 * {
 *   stringControl: {
 *     firstError: 'firstError'
 *   }
 * },
 * {
 *   stringControl: {
 *     secondError: 'secondError'
 *   }
 * }
 *
 * // Will result in:
 * {
 *   stringControl: {
 *     firstError: 'firstError',
 *     secondError: 'secondError'
 *   }
 * }
 *
 */
export function mergeFormGroupErrors<TControls extends FormControls>(
    ...errors: FormGroupErrors<TControls>[]
): FormGroupErrors<TControls> | null {
    return errors.reduce((group1, group2) => {
        if (!group1 && !group2) {
            return null;
        }

        if (!group1) {
            return group2;
        }

        if (!group2) {
            return group1;
        }

        return {
            ...group1,
            ...group2,
            ...Object.keys(group1)
                .filter(key1 => Object.keys(group2).find(key2 => key1 === key2))
                .map(key => ({
                    [key]: mergeFormControlErrors(group1[key], group2[key]),
                }))
                .reduce(
                    (e1, e2) => ({
                        ...e1,
                        ...e2,
                    }),
                    {}
                ),
        };
    }, null);
}

/**
 * Merges an array of errors.
 * Errors at each index will also be merged.
 * Returns null if all errors are null.
 * @param errors Multiple errors to be merged.
 *
 * @example
 * // Merge of:
 * [
 *   {
 *     firstError: 'firstError'
 *   }
 * ],
 * [
 *   stringControl: {
 *     secondError: 'secondError'
 *   }
 * ]
 *
 * // Will result in:
 * [
 *   {
 *     firstError: 'firstError',
 *     secondError: 'secondError'
 *   }
 * ]
 *
 */
export function mergeFormArrayErrors(...errors: FormArrayErrors[]): FormArrayErrors | null {
    const mergedErrors = errors
        .filter(Boolean)
        .reduce((arr1, arr2) => (arr1.length >= arr2.length ? arr1 : arr2), [])
        .map((_, i) => mergeFormControlErrors(...errors.map(arrayErrors => arrayErrors[i])));

    return mergedErrors.filter(Boolean).length > 0 ? mergedErrors : null;
}
