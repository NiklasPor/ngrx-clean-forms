// Base structural type
export interface FormControls {
    [key: string]: any;
}

// tslint:disable-next-line: no-empty-interface
export interface FormGroupBase<TControls extends FormControls> {}

// tslint:disable-next-line: no-empty-interface
export interface FormArrayBase<T> {}

// Updates
export interface FormControlUpdate<T> extends Partial<FormControlState<T>> {}

export interface FormGroupUpdate<TControls extends FormControls>
    extends Partial<FormGroupBase<TControls>> {
    controls?: FormGroupControlUpdates<TControls>;
}

export type FormGroupControlUpdates<TControls extends FormControls> = Partial<
    {
        [K in keyof TControls]: FormControlUpdate<TControls[K]>;
    }
>;

export type FormArrayControlUpdates<T> = FormControlUpdate<T>[];

export interface FormArrayUpdate<T> extends FormArrayBase<T> {
    controls?: FormArrayControlUpdates<T>;
}

// Initialization
/**
 * A FormControl validator.
 *
 * @param control A FormControl which the validator will be applied on.
 */
export type Validator<T> = (control: FormControlState<T>) => FormControlErrors | null;

/**
 * Can be either of:
 * @see `FormControlInitTuple`
 * @see `FormControlInitUpdate`
 */
export type FormControlInit<T> = FormControlInitTuple<T> | FormControlInitUpdate<T>;

/**
 * A shorthand to create a new FormControl.
 * - [0]: Initial value of the control.
 * - [1]: Validator array. Optional.
 */
export type FormControlInitTuple<T> = [T, Validator<T>[]?];

/**
 * An object of keys and associated `FormControlInit`.
 * @see `FormControlInit`
 */
export type FormGroupInit<TControls extends FormControls> = {
    [K in keyof TControls]: FormControlInit<TControls[K]>;
};

/**
 * An array of `FormControlInit`.
 * @see `FormControlInit`
 */
export type FormArrayInit<T> = FormControlInit<T>[];

/**
 * Explicit type to create a new FormControl.
 *
 * Identical to FormControlUpdate, except for `value` which is a required attribute here.
 */
export interface FormControlInitUpdate<T> extends FormControlUpdate<T> {
    /**
     * Initial value of the control.
     */
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
/**
 * Represents the state of a single FormControl.
 */
export interface FormControlState<T extends any> {
    value: T;

    /**
     * Indicates whether the value was not yet changed.
     */
    pristine: boolean;

    /**
     * Indicates whether the FormControl was not yet visited.
     */
    untouched: boolean;

    /**
     * Indicates whether the FormControl is disabled.
     */
    disabled: boolean;

    /**
     * Validators which will be used to calculate the errors.
     * Mainly used inside the summary creation.
     */
    validators: Validator<T>[];
}

export type FormGroupControlStates<TControls extends FormControls> = {
    [K in keyof TControls]: FormControlState<TControls[K]>;
};

/**
 * A FormGroup can contain multiple FormControls of different types, associated to a key.
 */
export interface FormGroupState<TControls extends FormControls> extends FormGroupBase<TControls> {
    /**
     * An object containing all controls of this group.
     */
    controls: FormGroupControlStates<TControls>;
}

/**
 * A FormArray can contain any number of FormControls.
 */
export interface FormArrayState<T> extends FormArrayBase<T> {
    /**
     * An array of all controls contained by this form.
     */
    controls: FormControlState<T>[];
}

// Summaries
/**
 * A summary of a `FormControlState`. Contains additional information.
 */
export interface FormControlSummary<T> extends FormControlState<T> {
    /**
     * An object containing all errors.
     *
     * Null if no errors were found.
     */
    errors: FormControlErrors;

    /**
     * Whether the FormControl has any errors.
     */
    valid: boolean;
}

export type FormGroupControlSummaries<TControls extends FormControls> = {
    [K in keyof TControls]: FormControlSummary<TControls[K]>;
};

/**
 * A summary of a `FormGroupState`. Contains additional information.
 */
export interface FormGroupSummary<TControls extends FormControls>
    extends FormGroupState<TControls> {
    /**
     * An object containing summaries of all controls.
     */
    controls: FormGroupControlSummaries<TControls>;

    /**
     * An object containing all errors. The used keys are the same as for the controls.
     *
     * If no error is found this value is null.
     */
    errors: FormGroupErrors<TControls>;

    /**
     * Indicates whether all of the FormControlSummaries inside this group are valid.
     */
    valid: boolean;

    /**
     * Indicates whether all of the values inside this group were not yet changed.
     */
    pristine: boolean;

    /**
     * Indicates whether all FormControls inside this group were not yet visited.
     */
    untouched: boolean;
}

/**
 * An array of control summaries.
 */
export type FormArrayControlSummaries<T> = FormControlSummary<T>[];

/**
 * A summary of a `FormArrayState`. Contains additional information.
 */
export interface FormArraySummary<T> extends FormArrayState<T> {
    controls: FormArrayControlSummaries<T>;

    /**
     * A convenience number array which contains the keys of the controls.
     *
     * For a array with the length of 2 this would be: `[0, 1]`
     */
    keys: number[];

    /**
     * An array containing all
     */
    errors: FormArrayErrors;

    /**
     * Indicates whether all of the FormControlSummaries inside this array are valid.
     */
    valid: boolean;

    /**
     * Indicates whether all of the values inside this array were not yet changed.
     */
    pristine: boolean;

    /**
     * Indicates whether all FormControls inside this array were not yet visited.
     */
    untouched: boolean;
}
