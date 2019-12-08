import { createSelector } from '@ngrx/store';
import { AppState } from './app.state';
import { getFormControlSummary, getFormGroupSummary } from 'ngrx-clean-forms';

export const selectExample = (state: AppState) => state.example;

export const selectSingleInput = createSelector(selectExample, state =>
    getFormControlSummary(state.singleControl)
);

export const selectFormGroup = createSelector(selectExample, state =>
    getFormGroupSummary(state.group)
);
