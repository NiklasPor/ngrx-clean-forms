import { FormControlState } from './types';
import { initFormControl } from './init';

export function resetFormControl<T>(
    control: FormControlState<T>,
    initialValue = control.initialValue
) {
    return initFormControl([initialValue, control.validators]);
}
