import {
  FormControl,
  FormControlUpdate,
  FormGroup,
  FormGroupUpdate
} from './types';

export function reduceFormControl<T>(
  control: FormControl<T>,
  update: FormControlUpdate<T>
): FormControl<T> {
  if (!control.validators && !control.value) {
    return control;
  }

  return {
    ...control,
    ...update
  };
}

export function reduceFormGroup<T>(group: FormGroup, update: FormGroupUpdate) {
  return {
    ...group,
    ...update
  };
}
