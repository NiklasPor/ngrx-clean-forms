type Modify<T, R> = Omit<T, keyof R> & R;

export interface FormControls {
    [key: string]: any;
}

export type Validator<T> = (control: FormControlState<T>) => FormControlErrors | null;

export type FormControlUpdate<T> = Partial<FormControlState<T>>;

export type FormGroupUpdate<TControls extends FormControls> = Modify<
    Partial<FormGroupState<TControls>>,
    { controls?: Partial<FormGroupControls<TControls>> }
>;

export interface FormControlErrors {
    [error: string]: any;
}

export type FormGroupErrors<TControls extends FormControls> = {
    [K in keyof TControls]: FormControlErrors;
};

export interface FormControlState<T> {
    value: T;
    pristine: boolean;
    untouched: boolean;
    validators: Validator<T>[];
}

export type FormGroupControls<TControls extends FormControls> = {
    [K in keyof TControls]: FormControlState<TControls[K]>;
};

export interface FormGroupState<TControls extends FormControls> {
    controls: FormGroupControls<TControls>;
}

export interface FormControlSummary<T> extends FormControlState<T> {
    errors: FormControlErrors;
    valid: boolean;
}

export type FormGroupControlSummaries<TControls extends FormControls> = {
    [K in keyof TControls]: FormControlSummary<TControls[K]>;
};

export interface FormGroupSummary<TControls extends FormControls>
    extends FormGroupState<TControls> {
    controls: FormGroupControlSummaries<TControls>;
    errors: FormGroupErrors<TControls>;
    valid: boolean;
    pristine: boolean;
    untouched: boolean;
}
