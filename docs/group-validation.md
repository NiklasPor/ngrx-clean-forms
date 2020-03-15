---
id: group-validation
title: Group Validation
---

In most cases the [validation of a single control](validators.md) is enough. But there are cases were the validation depends on values of multiple controls or even on other parts of the state.

```ts
type GroupValidator<TControls> = (
    group: FormGroupState<TControls>
) => FormGroupErrors<TControls> | null;
```

## Example

The validator in the following example checks if the values of `firstInput` and `secondInput` are equal. If they're equal both are a assigned an error with the key `duplicate`.

**Notice:** It is only possible to return errors which belog to an input. An error without an input is **not** a valid error.

```ts
import { FormGroupState } from 'ngrx-clean-forms';

export interface ExampleGroupControls {
    firstInput: string;
    secondInput: string;
}

const noDuplicate = (group: FormGroupState<ExampleGroupControls>) =>
    group.controls.firstInput.value === group.controls.secondInput.value
        ? {
              firstInput: {
                  duplicate: true,
              },
              secondInput: {
                  duplicate: true,
              },
          }
        : null;
```

## State Based Validation

It is also possible to add validators which do not depend on any of the controls, but instead listen to a value from the state. These can be added explicitly in the `getFormGroupSummary` method. The following example will check if the value of a control is equal to a value form the state.

While this solution is certainly not leightweight, it makes very complex validation logic possible. _Only use when no other validation methods suffice._

```ts
import { FormGroupErrors, FormGroupState, getFormGroupSummary } from 'ngrx-clean-forms';

// State Definition
export interface StateAccessExampleFormControls {
    exampleInput: number;
}

export interface State {
    stateAccessExampleGroup: FormGroupState<StateAccessExampleFormControls>;
    forbiddenNumber: number;
}

// Selectors
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
```
