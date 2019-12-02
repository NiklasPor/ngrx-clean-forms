import { FormGroupControls, FormControlState } from './types';

export function mapFormControls<T extends FormGroupControls, R>(
    controls: T,
    mapFunc: (control: FormControlState<any>, key: string) => R
): {
    [key: string]: R;
} {
    return Object.entries(controls)
        .map(([key, control]) => ({
            [key]: mapFunc(control, key),
        }))
        .reduce((ctrl1, ctrl2) => ({ ...ctrl1, ...ctrl2 }), {});
}
