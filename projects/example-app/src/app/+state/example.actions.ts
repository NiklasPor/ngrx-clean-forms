import { createAction, props } from '@ngrx/store';
import { FormControlUpdate, FormGroupUpdate } from 'ngrx-clean-forms';
import { ExampleFormControls, StateAccessExampleFormControls } from './example.reducer';

export const increment = createAction('[Counter Component] Increment');
export const updateSingleFormControl = createAction(
    '[Example] Update Single Control',
    props<{ update: FormControlUpdate<string> }>()
);

export const updateFormGroup = createAction(
    '[FormGroup] Update Form Group',
    props<{ update: FormGroupUpdate<ExampleFormControls> }>()
);

export const updateStateAccessExampleFormGroup = createAction(
    '[FormGroup] Update State Access Example Form Group',
    props<{ update: FormGroupUpdate<StateAccessExampleFormControls> }>()
);
