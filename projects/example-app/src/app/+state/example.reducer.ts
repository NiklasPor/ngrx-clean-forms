import { Validators } from '@angular/forms';
import { createReducer, on } from '@ngrx/store';
import {
    FormArrayState,
    FormControlState,
    FormGroupState,
    initFormArray,
    initFormControl,
    initFormGroup,
    reduceFormArray,
    reduceFormControl,
    reduceFormGroup,
    Validator,
    validatorOf,
} from 'ngrx-clean-forms';
import {
    addControlToArray,
    updateFormArray,
    updateFormGroup,
    updateSingleFormControl,
    updateStateAccessExampleFormGroup,
} from './example.actions';

const below6: Validator<number> = (control: FormControlState<number>) =>
    control.value < 6 ? null : { below6: false };

const required: Validator<string> = (control: FormControlState<string>) =>
    control.value.trim().length ? null : { required: true };

export interface ExampleGroupControls {
    textInput: string;
    numberInput: number;
    rangeInput: number;
    checkboxInput: boolean;
    customInput: number;
}

export interface StateAccessExampleFormControls {
    exampleInput: number;
}

export interface ExampleState {
    singleControl: FormControlState<string>;
    group: FormGroupState<ExampleGroupControls>;
    array: FormArrayState<string>;
    stateAccessExampleGroup: FormGroupState<StateAccessExampleFormControls>;
    forbiddenNumber: number;
}

export const initialState: ExampleState = {
    singleControl: initFormControl(['initial', [required]]),
    group: initFormGroup({
        textInput: { value: 'disabled', disabled: true },
        numberInput: [0, [validatorOf(Validators.required, Validators.max(4))]],
        rangeInput: [0],
        checkboxInput: [false],
        customInput: [0],
    }),
    array: initFormArray([['first'], ['second']]),
    stateAccessExampleGroup: initFormGroup({ exampleInput: [1] }),
    forbiddenNumber: 2,
};

const internalExampleReducer = createReducer(
    initialState,

    on(updateSingleFormControl, (state, { update }) => ({
        ...state,
        singleControl: reduceFormControl(state.singleControl, update),
    })),

    on(updateFormGroup, (state, { update }) => ({
        ...state,
        group: reduceFormGroup(state.group, update),
    })),

    on(updateFormArray, (state, { update }) => ({
        ...state,
        array: reduceFormArray(state.array, update),
    })),

    on(addControlToArray, state => ({
        ...state,
        array: {
            ...state.array,
            controls: [...state.array.controls, initFormControl(['new'])],
        },
    })),

    on(updateStateAccessExampleFormGroup, (state, props) => ({
        ...state,
        stateAccessExampleGroup: reduceFormGroup(state.stateAccessExampleGroup, props.update),
    }))
);

export function exampleReducer(state, action) {
    return internalExampleReducer(state, action);
}
