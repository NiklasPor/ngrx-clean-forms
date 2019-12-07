import {
    FormControlState,
    FormGroupState,
    FormGroupControls,
    FormControls,
} from './../../../projects/ngrx-clean-forms/src/lib/types';
import { createReducer, on } from '@ngrx/store';
import { increment, updateSingleFormControl, updateFormGroup } from './example.actions';
import {
    initialFormControl,
    reduceFormControl,
    initialFormGroup,
    reduceFormGroup,
} from 'projects/ngrx-clean-forms/src/lib/reducer';
import { validatorOf, mapFormControls } from 'projects/ngrx-clean-forms/src/lib/utils';
import { Validators } from '@angular/forms';

const required = (control: FormControlState<string>) =>
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
    singleControl: initialFormControl('initial', [required]),
    group: initialFormGroup({
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
