import { FormControlUpdate } from './../../../projects/ngrx-clean-forms/src/lib/types';
import { createAction, props } from '@ngrx/store';

export const increment = createAction('[Counter Component] Increment');
export const updateSingleFormControl = createAction(
    '[Form] Update',
    props<{ update: FormControlUpdate<string> }>()
);
