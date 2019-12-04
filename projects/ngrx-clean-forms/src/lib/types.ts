export type Validator<T> = (control: FormControlState<T>) => FormControlErrors | null;

export type FormControlUpdate<T> = Partial<FormControlState<T>>;

export interface FormGroupUpdate<T extends FormGroupControls = FormGroupControls>
    extends Partial<FormGroupState> {
    controls: Partial<T>;
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
    untouched: boolean;
    validators: Validator<T>[];
}

export interface FormGroupControls {
    [controlKey: string]: FormControlState<any>;
}

export interface FormGroupState<T extends FormGroupControls = FormGroupControls> {
    controls: T;
}

export interface FormControlSummary<T> extends FormControlState<T> {
    errors: FormControlErrors;
    valid: boolean;
}

export interface FormGroupControlSummaries extends FormGroupControls {
    [controlKey: string]: FormControlSummary<any>;
}

export interface FormGroupSummary<T extends FormGroupControlSummaries = FormGroupControlSummaries>
    extends FormGroupState {
    controls: T;
    errors: FormGroupErrors;
    valid: boolean;
    pristine: boolean;
    untouched: boolean;
}