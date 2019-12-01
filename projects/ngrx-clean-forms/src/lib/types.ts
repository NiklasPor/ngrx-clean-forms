export type Validator<T> = (control: FormControlState<T>) => FormControlErrors | null;

export type FormControlUpdate<T> = Partial<FormControlState<T>>;

export interface FormGroupUpdate extends Partial<FormGroupState> {
    controls: Partial<FormGroupControls>;
}

export interface FormControlErrors {
    [error: string]: any;
}

export interface FormGroupErrors {
    [controlKey: string]: FormControlErrors;
}

export interface FormControlState<T> {
    value: T;
    pristine: boolean;
    touched: boolean;
    validators: Validator<T>[];
}

export interface FormGroupControls {
    [controlKey: string]: FormControlState<any>;
}

export interface FormGroupState<T = FormGroupControls> {
    controls: T;
    pristine: boolean;
}

export interface FormControlSummary<T> extends FormControlState<T> {
    errors: FormControlErrors;
    valid: boolean;
}

export interface FormGroupControlSummaries extends FormGroupControls {
    [controlKey: string]: FormControlSummary<any>;
}

export interface FormGroupSummary extends FormGroupState {
    controls: FormGroupControlSummaries;
    errors: FormGroupErrors;
}
