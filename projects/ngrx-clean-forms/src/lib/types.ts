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

export type FormGroupControlSummaries<TControls extends FormGroupControls> = {
    [K in keyof TControls]: FormControlSummary<any>;
};

export interface FormGroupSummary<TControls extends FormGroupControls> extends FormGroupState {
    controls: FormGroupControlSummaries<TControls>;
    errors: FormGroupErrors;
    valid: boolean;
    pristine: boolean;
    untouched: boolean;
}
