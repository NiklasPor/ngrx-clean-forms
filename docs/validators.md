---
id: form-validation
title: Validation
---

A `Validator` inside this framework is a pure function, which takes a `FormControlState` and returns `FormControlErrors` or null. Null is returned in the case that no errors occured and the validation succeeded.

```ts
type Validator<T> = (control: FormControlState<T>) => FormControlErrors | null;
```

## Example

This validator example checks if the value is `6` and if not returns an the following object: `{notSix: actualValue}`.

```ts
import { FormControlState } from 'ngrx-clean-forms';

const notSix = (control: FormControlState<number>) =>
    control.value === 6 ? null : { notSix: control.value };
```

## Angular Validators

The [Validators](https://angular.io/api/forms/Validators) provided by Angular are also usable with _ngrx-clean-forms_. By using the `validatorOf()` functions from Angular can be converted. It's also possible to pass multiple Angular validators at once.

Asynchronous validators can **not** be used, as they are no pure functions.

```ts
import { validatorOf } from 'ngrx-clean-forms';
import { Validators } from '@angular/forms';

validatorOf(Validators.max(4), Validators.required);
```
