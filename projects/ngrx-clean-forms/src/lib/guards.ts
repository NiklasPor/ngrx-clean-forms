import { FormArrayState, FormGroupState } from './types';

export function isFormArray(formArray: FormArrayState<any>) {
    return typeof formArray === 'object' && Array.isArray(formArray.controls);
}

export function isFormGroup(formGroup: FormGroupState<any>) {
    return (
        typeof formGroup === 'object' &&
        formGroup.controls &&
        typeof formGroup.controls === 'object'
    );
}
