export type Validator<T> = (control: FormControlState<T>) => FormControlErrors | null;

export type FormGroupUpdate = Partial<FormGroupState>;
export type FormControlUpdate<T> = Partial<FormControlState<T>>;

export interface FormGroupCreation {
    [controlKey: string]: FormControlState<any>;
}

export interface FormControlErrors {
    [error: string]: any;
}

export interface FormControlState<T> {
    value: T;
    pristine: boolean;
    validators: Validator<T>[];
}

export interface FormGroupControls {
    [controlKey: string]: FormControlState<any>;
}

export interface FormGroupState {
    controls: FormGroupControls;
    pristine: boolean;
}

export interface FormControlSummary<T> extends FormControlState<T> {
    errors: FormControlErrors;
}

export interface FormGroupControlSummaries extends FormGroupControls {
    [controlKey: string]: FormControlSummary<any>;
}

export interface FormGroupSummary extends FormGroupState {
    controls: FormGroupControlSummaries;
    errors: FormGroupErrors;
}
