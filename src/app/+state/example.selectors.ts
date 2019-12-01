import { createSelector } from '@ngrx/store';
import { AppState } from './app.state';

export const selectExample = (state: AppState) => state.example;

export const selectTest = createSelector(selectExample, state => state.test);
