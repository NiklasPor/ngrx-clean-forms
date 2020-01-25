type Modify<T, R> = Omit<T, keyof R> & R;

// Base structural type
export interface FormControls {
    [key: string]: any;
}

// Updates
export type FormControlUpdate<T> = Partial<FormControlState<T>>;

export type FormGroupUpdate<TControls extends FormControls> = Modify<
    Partial<FormGroupState<TControls>>,
    { controls?: FormGroupControlUpdates<TControls> }
>;

export type FormGroupControlUpdates<TControls extends FormControls> = Partial<
    {
        [K in keyof TControls]: FormControlUpdate<TControls[K]>;
    }
>;

export type FormArrayControlUpdates<T> = FormControlUpdate<T>[];

export type FormArrayUpdate<T> = Modify<
    Partial<FormArrayState<T>>,
    { controls?: FormArrayControlUpdates<T> }
>;

// Initialization
export type Validator<T> = (control: FormControlState<T>) => FormControlErrors | null;

export type FormControlInit<T> = FormControlInitTuple<T> | FormControlInitUpdate<T>;

export type FormControlInitTuple<T> = [T, Validator<T>[]?];

export type FormGroupInit<TControls extends FormControls> = {
    [K in keyof TControls]: FormControlInit<TControls[K]>;
};

export type FormArrayInit<T> = FormControlInit<T>[];

export interface FormControlInitUpdate<T> extends FormControlUpdate<T> {
    value: T;
}

// Errors
export interface FormControlErrors {
    [error: string]: any;
}

export type FormGroupErrors<TControls extends FormControls> = {
    [K in keyof Partial<TControls>]: FormControlErrors;
};

export type FormArrayErrors = FormControlErrors[];

// States
export interface FormControlState<T extends any> {
    value: T;
    pristine: boolean;
    untouched: boolean;
    disabled: boolean;
    validators: Validator<T>[];
}

export type FormGroupControlStates<TControls extends FormControls> = {
    [K in keyof TControls]: FormControlState<TControls[K]>;
};

export interface FormGroupState<TControls extends FormControls> {
    controls: FormGroupControlStates<TControls>;
}

export interface FormArrayState<T> {
    controls: FormControlState<T>[];
}

// Summaries
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

export type FormArrayControlSummaries<T> = FormControlSummary<T>[];

export interface FormArraySummary<T> extends FormArrayState<T> {
    controls: FormArrayControlSummaries<T>;
    errors: FormArrayErrors;
    valid: boolean;
    pristine: boolean;
    untouched: boolean;
}
