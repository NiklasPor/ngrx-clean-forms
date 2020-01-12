import { createSelector } from '@ngrx/store';
import { FormGroupErrors, getFormControlSummary, getFormGroupSummary } from 'ngrx-clean-forms';
import { AppState } from './app.state';
import { StateAccessExampleFormControls } from './example.reducer';

export const selectExample = (state: AppState) => state.example;

export const selectSingleInput = createSelector(selectExample, state =>
    getFormControlSummary(state.singleControl)
);

export const selectFormGroup = createSelector(selectExample, state =>
    getFormGroupSummary(state.group)
);

export const selectForbiddenNumber = createSelector(selectExample, state => state.forbiddenNumber);

export const selectForbiddenNumberError = createSelector(
    selectExample,
    (state): FormGroupErrors<StateAccessExampleFormControls> =>
        state.forbiddenNumber === state.stateAccessExampleGroup.controls.exampleInput.value
            ? {
                  exampleInput: {
                      externalNumberError: true,
                  },
              }
            : null
);

export const selectStateAccessExampleGroup = createSelector(
    selectExample,
    selectForbiddenNumberError,
    (state, forbiddenNumberError) =>
        getFormGroupSummary(state.stateAccessExampleGroup, forbiddenNumberError)
);
