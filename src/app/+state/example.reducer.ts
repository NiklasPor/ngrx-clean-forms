import { createReducer, on } from '@ngrx/store';
import { increment } from './example.actions';

export interface ExampleState {
    test: string;
}

export const initialState: ExampleState = {
    test: 'test',
};

const internalExampleReducer = createReducer(
    initialState,
    on(increment, state => ({ ...state, test: state.test + '-' }))
);

export function exampleReducer(state, action) {
    return internalExampleReducer(state, action);
}
