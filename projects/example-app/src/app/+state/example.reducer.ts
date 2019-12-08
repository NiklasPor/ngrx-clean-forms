import { Validators } from '@angular/forms';
import { createReducer, on } from '@ngrx/store';
import {
    FormControlState,
    FormGroupState,
    initFormControl,
    initFormGroup,
    reduceFormControl,
    reduceFormGroup,
    Validator,
    validatorOf,
} from 'ngrx-clean-forms';
import { updateFormGroup, updateSingleFormControl } from './example.actions';

const required: Validator<string> = (control: FormControlState<string>) =>
    control.value.trim().length ? null : { required: true };

export interface ExampleFormControls {
    textInput: string;
    numberInput: number;
    rangeInput: number;
    checkboxInput: boolean;
    customInput: number;
}

export interface ExampleState {
    singleControl: FormControlState<string>;
    group: FormGroupState<ExampleFormControls>;
}

export const initialState: ExampleState = {
    singleControl: initFormControl('initial', [required]),
    group: initFormGroup({
        textInput: [''],
        numberInput: [0, [validatorOf(Validators.max(4))]],
        rangeInput: [0],
        checkboxInput: [false],
        customInput: [0],
    }),
};

const internalExampleReducer = createReducer(
    initialState,
    on(updateSingleFormControl, (state, props) => ({
        ...state,
        singleControl: reduceFormControl(state.singleControl, props.update),
    })),
    on(updateFormGroup, (state, props) => ({
        ...state,
        group: reduceFormGroup(state.group, props.update),
    }))
);

export function exampleReducer(state, action) {
    return internalExampleReducer(state, action);
}
