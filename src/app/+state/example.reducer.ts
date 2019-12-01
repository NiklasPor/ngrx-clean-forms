import { FormControlState } from './../../../projects/ngrx-clean-forms/src/lib/types';
import { createReducer, on } from '@ngrx/store';
import { increment, updateSingleFormControl } from './example.actions';
import { initialFormControl, reduceFormControl } from 'projects/ngrx-clean-forms/src/lib/reducer';

export interface ExampleState {
    test: string;
    singleControl: FormControlState<string>;
}

export const initialState: ExampleState = {
    test: 'test',
    singleControl: initialFormControl('initial', []),
};

const internalExampleReducer = createReducer(
    initialState,
    on(increment, state => ({ ...state, test: state.test + '-' })),
    on(updateSingleFormControl, (state, props) => ({
        ...state,
        singleControl: reduceFormControl(state.singleControl, props.update),
    }))
);

export function exampleReducer(state, action) {
    return internalExampleReducer(state, action);
}
