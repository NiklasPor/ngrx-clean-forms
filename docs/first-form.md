---
id: first-form
title: Setting up a form
---

First of all basic knowledge of the follwing topics is recommended:

-   Angular
-   NgRx v8

This page guides you through creating a simple form and integrating it in a NgRx state. It'll contain a `string` and `number` input.

## Component

The directives `ngrxFormGroup` and `ngrxFormControl` can be used to bind a form to a `FormGroupSummary`. The `[formSummary]` input writes changes from the state to the form and the `(formUpdate)` output dispatches updates to the state whenever the form changes.

```html
<form ngrxFormGroup [formSummary]="formGroup$ | async" (formUpdate)="updateFormGroup($event)">
    <input type="text" ngrxFormControl="textInput" />
    <input type="number" ngrxFormControl="numberInput" />
</form>
```

Inside the component logic the values will be simply passed to the state.

```javascript
export class ExampleComponent {
    formGroup$ = this.store.select(selectFormGroup);

    updateFormGroup(update: FormGroupUpdate<ExampleFormControls>) {
        this.store.dispatch(updateFormGroup({ update }));
    }
}
```

The code example above shows that we'll need two interfaces between the component and the state. We'll need to retrieve (select) the state of the form and we'll also need to dispatch form updates. The implementation of this will be shown in the chapter below.

## State

With the approach of this framework the actual state only contains the minimal necessary values. Errors and other similar indirect values are abstracted inside so called Summaries. They will be created inside of the NgRx selectors.

### Types

The form type can be created by passing an object `TControls` to `FormGroupState<TControls>`. This one can then be included in the type definition of the state. In general the best practice is to also export the `TControls` object alone, for reusage with other types.

```typescript
import { FormControlState, FormGroupState } from 'ngrx-clean-forms';

export interface ExampleFormControls {
    textInput: string;
    numberInput: number;
}

export interface ExampleState {
    group: FormGroupState<ExampleFormControls>;
}
```

### Initial state

The initial state of the form can be created by using `initFormGroup<TControls>`. Optionally the type can also be passed explicitly to function (as in the example below), which makes the lint errors more specific.

In the example below the array syntax is used for the intialization of the single controls. There are also more explicit approaches available, which can be seen in the `FormControl` chapter of this documentation.

```typescript
import { initFormGroup } from 'ngrx-clean-forms';

export const initialState: ExampleState = {
    group: initFormGroup<ExampleFormControls>({
        textInput: [''],
        numberInput: [0],
    }),
};
```

### Actions

The only necessary action is an update, which will be applied by the reducer. The `FromGroupUpdate` type is a partial of the `FormGroupState`, which will be merged into the current state. It could be defined like this:

```typescript
import { createAction, props } from '@ngrx/store';
import { FormGroupUpdate } from 'ngrx-clean-forms';
import { ExampleFormControls } from './example.reducer';

export const updateFormGroup = createAction(
    '[FormGroup] Update Form Group',
    props<{ update: FormGroupUpdate<ExampleFormControls> }>()
);
```

### Reducer

Inside of the reducer all updates to the form are applied. The method `updateFormGroup` can be used to easily apply an update to the `FormGroupState`. This method can be used **both** for manual and automatic updates (done by the directive output).

```typescript
import { reduceFormGroup } from 'ngrx-clean-forms';

const exampleReducer = createReducer(
    initialState,
    on(updateFormGroup, (state, props) => ({
        ...state,
        group: reduceFormGroup(state.group, props.update),
    }))
);
```

### Selectors

The selectors will publish the `FormGroupState` and create a `FormGroupSummary` of it. The summary includes additional information like errors, touched and similar attributes.

```typescript
import { getFormGroupSummary } from 'ngrx-clean-forms';

export const selectFormGroup = createSelector(selectExample, state =>
    getFormGroupSummary(state.group)
);
```

## Conclusion

After creating:

-   Types
-   Initial state
-   Actions
-   Reducer functions
-   Selectors

we're able to bind our form to our state. While this is certainly a lot of boilerplate to write, we also managed to leverage our form into our state. Now it is available inside the whole application and can be reused anywhere by using the `FormGroupSummary` selector.
