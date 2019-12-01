export type Validator<T> = (control: FormControl<T>) => FormControlError | null;

export type FormGroupUpdate = Partial<FormGroup>;
export type FormControlUpdate<T> = Partial<FormControl<T>>;

export interface FormControlError {
    [error: string]: any;
}

export interface FormControl<T> {
    value: T;
    validators: Validator<T>[];
}

export interface FormGroup {
    [controlKey: string]: FormControl<any>;
}

export interface FormGroupErrors {
    [controlKey: string]: FormControlError;
}
