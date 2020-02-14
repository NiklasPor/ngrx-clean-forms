---
id: control-initialization
title: Initialization
---

There are multiple ways to create a new `FormControlState` with ngrx-clean-forms. While nothing speaks against setting up the form manually, the common way for initialization is to use `initFormControl()`.

The initialization method supports two different ways of creating a new `FormControlState`. One shorthand and one more explicit way:

## Tuple Initialization

This initialization method is a shorthand and only supports the following two attributes to be set:

-   `value: T`
-   `validators?: Validator[]`

#### Without validators

```ts
import { initFormControl } from 'ngrx-clean-forms';

initFormControl(['initial']);
```

#### With validators

```ts
import { initFormControl, Validator, FormControlState } from 'ngrx-clean-forms';

const below6: Validator<number> = (control: FormControlState<number>) =>
    control.value < 6 ? null : { below6: false };

initFormControl([4, [below6]]);
```

## Update Initialization

The update initialization is the more explicit way to initialize a `FormControlState`. This initialization method supports **all** properties that can be set in a `FormControlState`.

The only required value is the actual value of the `FormControlState`. Other values have predefined default and will be set in the following manner.

-   `initialValue`: Defaults to the passed `value`, if not explicitly set.
-   `pristine`: `true`
-   `untouched`: `true`
-   `disabled`: `false`
-   `validators`: `[]`

#### Initially disabled

```ts
import { initFormControl } from 'ngrx-clean-forms';

initFormControl({
    value: 'initial',
    disabled: true,
});
```

#### With validators

```ts
import { initFormControl, Validator, FormControlState } from 'ngrx-clean-forms';

const below6: Validator<number> = (control: FormControlState<number>) =>
    control.value < 6 ? null : { below6: false };

initFormControl({
    value: 4,
    validators: [below6]
}]);
```
