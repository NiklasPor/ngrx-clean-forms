import { createSelector } from '@ngrx/store';
import { AppState } from './app.state';
import {
    getFormControlSummary,
    getFormGroupSummary,
} from 'projects/ngrx-clean-forms/src/lib/selectors';

export const selectExample = (state: AppState) => state.example;

export const selectTest = createSelector(selectExample, state => state.test);

export const selectSingleInput = createSelector(selectExample, state =>
    getFormControlSummary(state.singleControl)
);

export const selectFormGroup = createSelector(selectExample, state =>
    getFormGroupSummary(state.group)
);
