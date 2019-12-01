import {
    FormControlState,
    FormGroupState,
} from './../../../projects/ngrx-clean-forms/src/lib/types';
import { createReducer, on } from '@ngrx/store';
import { increment, updateSingleFormControl, updateFormGroup } from './example.actions';
import {
    initialFormControl,
    reduceFormControl,
    initialFormGroup,
    reduceFormGroup,
} from 'projects/ngrx-clean-forms/src/lib/reducer';

const required = (control: FormControlState<string>) =>
    control.value.trim().length ? null : { required: true };

export type ExampleFormState = FormGroupState<{
    firstInput: FormControlState<string>;
    secondInput: FormControlState<string>;
}>;

export interface ExampleState {
    test: string;
    singleControl: FormControlState<string>;
    group: ExampleFormState;
}

export const initialState: ExampleState = {
    test: 'test',
    singleControl: initialFormControl('initial', [required]),
    group: initialFormGroup({
        firstInput: initialFormControl(''),
        secondInput: initialFormControl(''),
    }),
};

const internalExampleReducer = createReducer(
    initialState,
    on(increment, state => ({ ...state, test: state.test + '-' })),
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
