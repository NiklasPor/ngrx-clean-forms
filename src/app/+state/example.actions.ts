import { createAction, props } from '@ngrx/store';
import {
    FormControlUpdate,
    FormGroupUpdate,
} from './../../../projects/ngrx-clean-forms/src/lib/types';
import { ExampleFormControls } from './example.reducer';

export const increment = createAction('[Counter Component] Increment');
export const updateSingleFormControl = createAction(
    '[Example] Update Single Form',
    props<{ update: FormControlUpdate<string> }>()
);

export const updateFormGroup = createAction(
    '[FormGroup] Update Form Group',
    props<{ update: FormGroupUpdate<ExampleFormControls> }>()
);
