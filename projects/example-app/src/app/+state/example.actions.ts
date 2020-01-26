import { createAction, props } from '@ngrx/store';
import { FormArrayUpdate, FormControlUpdate, FormGroupUpdate } from 'ngrx-clean-forms';
import { ExampleGroupControls, StateAccessExampleFormControls } from './example.reducer';

export const increment = createAction('[Counter Component] Increment');
export const updateSingleFormControl = createAction(
    '[Example] Update Single Control',
    props<{ update: FormControlUpdate<string> }>()
);

export const updateFormGroup = createAction(
    '[FormGroup] Update Form Group',
    props<{ update: FormGroupUpdate<ExampleGroupControls> }>()
);

export const updateFormArray = createAction(
    '[FormArray] Update Form Array',
    props<{ update: FormArrayUpdate<string> }>()
);

export const addControlToArray = createAction('[FormArray] Add Control');

export const updateStateAccessExampleFormGroup = createAction(
    '[StateAccess] Update State Access Example Form Group',
    props<{ update: FormGroupUpdate<StateAccessExampleFormControls> }>()
);
