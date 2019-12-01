import {
    FormControlUpdate,
    FormGroupUpdate,
} from './../../../projects/ngrx-clean-forms/src/lib/types';
import { createAction, props } from '@ngrx/store';

export const increment = createAction('[Counter Component] Increment');
export const updateSingleFormControl = createAction(
    '[SingleForm] Update',
    props<{ update: FormControlUpdate<string> }>()
);

export const updateFormGroup = createAction(
    '[FormGroup] Update',
    props<{ update: FormGroupUpdate }>()
);
