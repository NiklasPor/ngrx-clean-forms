import { AbstractControl, ValidatorFn } from '@angular/forms';
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

export function mapFormControlStates<TControls extends FormControls, R>(
    controls: FormGroupControlStates<TControls>,
    mapFunc: (control: FormControlState<any>, key: string) => R
): {
    [K in keyof TControls]: R;
} {
    return mapFormControls<TControls, R>(controls, mapFunc);
}

export function mapFormControlSummaries<TControls extends FormControls, R>(
    controls: FormGroupControlSummaries<TControls>,
    mapFunc: (control: FormControlSummary<any>, key: string) => R
): {
    [K in keyof TControls]: R;
} {
    return mapFormControls<TControls, R>(controls, mapFunc);
}

export function mapFormControlUpdates<TControls extends FormControls, R>(
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

export function mergeFormArrayErrors(...errors: FormArrayErrors[]): FormArrayErrors | null {
    const mergedErrors = errors
        .filter(Boolean)
        .reduce((arr1, arr2) => (arr1.length >= arr2.length ? arr1 : arr2), [])
        .map((_, i) => mergeFormControlErrors(...errors.map(arrayErrors => arrayErrors[i])));

    return mergedErrors.filter(Boolean).length > 0 ? mergedErrors : null;
}
