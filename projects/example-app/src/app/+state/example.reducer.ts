import * as ExampleActions from './example.actions';

import {
    ArrayValidator,
    FormArrayState,
    FormControlState,
    FormGroupState,
    Validator,
    initFormArray,
    initFormControl,
    initFormGroup,
    reduceFormArray,
    reduceFormControl,
    reduceFormGroup,
    resetFormGroup,
    validatorOf,
} from 'ngrx-clean-forms';
import { createReducer, on } from '@ngrx/store';

import { Validators } from '@angular/forms';

const below6: Validator<number> = (control: FormControlState<number>) =>
    control.value < 6 ? null : { below6: false };

const required: Validator<string> = (control: FormControlState<string>) =>
    control.value.trim().length ? null : { required: true };

const noDuplicates: ArrayValidator<string> = ({ controls }) =>
    controls
        .map((control) =>
            controls.find(
                (bufferCtrl) => control !== bufferCtrl && control.value === bufferCtrl.value
            )
        )
        .map((result) => (result ? { duplicate: true } : null));

const allRequired: ArrayValidator<string> = ({ controls }) =>
    controls.map((control) => validatorOf(Validators.required)(control));

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
        numberInput: [0, [validatorOf(Validators.required), below6]],
        rangeInput: [0],
        checkboxInput: [false],
        customInput: [0],
    }),

    array: initFormArray([['first'], ['second']], [noDuplicates, allRequired]),

    stateAccessExampleGroup: initFormGroup({ exampleInput: [1] }),
    forbiddenNumber: 2,
};

const internalExampleReducer = createReducer(
    initialState,

    on(ExampleActions.updateSingleFormControl, (state, { update }) => ({
        ...state,
        singleControl: reduceFormControl(state.singleControl, update),
    })),

    on(ExampleActions.updateFormGroup, (state, { update }) => ({
        ...state,
        group: reduceFormGroup(state.group, update),
    })),

    on(ExampleActions.resetFormGroup, (state) => ({
        ...state,
        group: resetFormGroup(state.group),
    })),

    on(ExampleActions.updateFormArray, (state, { update }) => ({
        ...state,
        array: reduceFormArray(state.array, update),
    })),

    on(ExampleActions.addControlToArray, (state) => ({
        ...state,
        array: {
            ...state.array,
            controls: [...state.array.controls, initFormControl(['new'])],
        },
    })),

    on(ExampleActions.updateStateAccessExampleFormGroup, (state, props) => ({
        ...state,
        stateAccessExampleGroup: reduceFormGroup(state.stateAccessExampleGroup, props.update),
    }))
);

export function exampleReducer(state, action) {
    return internalExampleReducer(state, action);
}
