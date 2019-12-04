import {
    FormControlState,
    FormGroupState,
    FormGroupControls,
} from './../../../projects/ngrx-clean-forms/src/lib/types';
import { createReducer, on } from '@ngrx/store';
import { increment, updateSingleFormControl, updateFormGroup } from './example.actions';
import {
    initialFormControl,
    reduceFormControl,
    initialFormGroup,
    reduceFormGroup,
} from 'projects/ngrx-clean-forms/src/lib/reducer';
import { of } from 'projects/ngrx-clean-forms/src/lib/utils';
import { Validators } from '@angular/forms';

const required = (control: FormControlState<string>) =>
    control.value.trim().length ? null : { required: true };

export interface ExampleFormControls extends FormGroupControls {
    textInput: FormControlState<string>;
    numberInput: FormControlState<number>;
    rangeInput: FormControlState<number>;
    checkboxInput: FormControlState<boolean>;
    customInput: FormControlState<number>;
}

export interface ExampleState {
    singleControl: FormControlState<string>;
    group: FormGroupState<ExampleFormControls>;
}

export const initialState: ExampleState = {
    singleControl: initialFormControl('initial', [required]),
    group: initialFormGroup({
        textInput: initialFormControl(''),
        numberInput: initialFormControl(0, [of(Validators.max(4))]),
        rangeInput: initialFormControl(0),
        checkboxInput: initialFormControl(false),
        customInput: initialFormControl(1),
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
