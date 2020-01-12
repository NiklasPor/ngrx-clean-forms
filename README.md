[![npm version](https://badge.fury.io/js/ngrx-clean-forms.svg)](https://badge.fury.io/js/ngrx-clean-forms)
[![codecov](https://codecov.io/gh/NiklasPor/ngrx-clean-forms/branch/master/graph/badge.svg)](https://codecov.io/gh/NiklasPor/ngrx-clean-forms)
![license](https://img.shields.io/npm/l/ngrx-clean-forms)

# ngrx-clean-forms

This library contains the necessary tools to integrate the form management into the general state management of an application. While this library was written with the usage of [NgRx](https://ngrx.io/docs) in mind, it has no dependency to it. Therefore it can also be used with other frameworks like [NgXs](https://www.ngxs.io/).

This library excels in the following topics:

-   Having a strict typing approach. Types of forms will be available throughout the whole interaction with the state.
-   Providing validation errors and similar attributes as a transformation (selector).
-   Keeping the data flow transparent and minimalistic.
-   Providing a single source of truth for a form. Even linking multiple instances of a form to a single form state is possible.

## Table of Contents

-   [Getting Started](#getting-started)
    -   [Import the NgrxCleanFormsModule](#import-the-ngrxcleanformsmodule)
    -   [Add the form state to your state managment](#add-the-form-state-to-your-state-managment)
    -   [Accessing the form state & errors](#accessing-the-form-state-&-errors)
    -   [Updating (reducing) the form state](#updating-reducing-the-form-state)
    -   [Binding your HTML form to your state](#binding-your-html-form-to-your-state)
-   [Additional Resources](#additional-resources)
    -   [Adding validators](#adding-validators)
    -   [Using the Angular forms validators](#using-the-angular-forms-validators)
    -   [Adding custom (state based) validation](#adding-custom-state-based-validation)
    -   [Displaying errors (CSS classes)](#displaying-errors-css-classes)
    -   [Displaying errors (values)](#displaying-errors-values)
    -   [Binding to custom input components](#binding-to-custom-input-components)
    -   [Binding to an input without a form](#binding-to-an-input-without-a-form)
    -   [Binding multiple html forms to the same state](#binding-multiple-html-forms-to-the-same-state)
    -   [Disabling forms / Setting disabled](#disabling-forms-/-setting-disabled)
-   [Not yet supported features](#not-yet-supported-features)

## Getting Started

```
npm i ngrx-clean-forms
```

### Import the NgrxCleanFormsModule

After installing the package you'll have to include it in your module. You **won't** need an import to another FormModule (e.g. `ReactiveFormsModule` or `FormsModule`) when you use this framework.

From the `app.module.ts` (could be any module) of the _example-application_ inside this repository:

```typescript
import { NgrxCleanFormsModule } from 'ngrx-clean-forms';

@NgModule({
    imports: [
        NgrxCleanFormsModule,
        ..
    ],
    ...
})
export class AppModule {}
```

### Add the form state to your state managment

First create a type which displays the structure of your form and add it to your state. From the example application:

```typescript
import { FormControlState, FormGroupState } from 'ngrx-clean-forms';

export interface ExampleFormControls {
    textInput: string;
    numberInput: number;
    ..
}

export interface ExampleState {
    group: FormGroupState<ExampleFormControls>;
    ..
}
```

To create the initial state of your FormGroup you can use the provided helper method `initFormGroup<TControls>()` and pass matching initial values to it:

```typescript
import { initFormGroup } from 'ngrx-clean-forms';

export const initialState: ExampleState = {
    group: initFormGroup<ExampleFormControls>({
        textInput: [''],
        numberInput: [0],
        ..
    }),
};
```

The explicit passing of the generic type is optional, but it's way easier to find invalid property types when you specify it.

### Accessing the form state & errors

The `FormControlSummary<T>` and `FormGroupSummary<TControls>` provide a summary of their counterparts `FormControlState<T>` and `FormGroupState<TControls>`. They also include errors and further additions which depend on the state.

In `NgRX` we'd create a selector retrieving the summaries. You can utilize the `getFormGroupSummary()` or `getFormControlSummary()` methods:

```typescript
import { getFormGroupSummary } from 'ngrx-clean-forms';

export const selectFormGroup = createSelector(selectExample, state =>
    getFormGroupSummary(state.group)
);
```

### Updating (reducing) the form state

Just like the `Summary` types there are `Update` types you can utilize for updating the form state.

In `NgRx` we'd create a `Action`, supplying the data necessary for the state update.

```typescript
import { createAction, props } from '@ngrx/store';
import { FormGroupUpdate } from 'ngrx-clean-forms';
import { ExampleFormControls } from './example.reducer';

export const updateFormGroup = createAction(
    '[FormGroup] Update Form Group',
    props<{ update: FormGroupUpdate<ExampleFormControls> }>()
);
```

After defining the action we can extend the reduce function of our application and add the code to handle the form updates. The `reduceFormGroup()` and `reduceFormControl()` methods can be used to apply a `FormGroupUpdate` to a `FormGroupState` (or a `FormControlUpdate` to a `FormControlState`):

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

### Binding your HTML form to your state

After creating a selector to access the `FormGroupSummary` and an action to apply a `FormGroupUpdate` we're able to two-way bind our forms to our template. Inside our component we need to create an observable and a method. The observable receives the `FormGroupSummary` and the method pushes a `FormGroupUpdate`:

`component.ts`:

```typescript
export class ExampleComponent {
    formGroup$ = this.store.select(selectFormGroup);

    updateFormGroup(update: FormGroupUpdate<ExampleFormControls>) {
        this.store.dispatch(updateFormGroup({ update }));
    }
}
```

`component.html`:

```html
<form ngrxForm [formSummary$]="formGroup$" (formUpdate)="updateFormGroup($event)">
    <input type="text" ngrxControl="textInput" />
    <input type="number" ngrxControl="numberInput" />
</form>
```

## Additional Resources

### Adding validators

Out of the box this library does not include any validators. But you're able to convert the validators already provided by Angular: [Using the already existing Angular form validators](#Using-the-angular-forms-validators).

The validators inside this module have two valid results:

-   null: No error appeared.
-   object: An error object containing information to the error that occured.

If you'd want to add your own **required** validator for a `FormControl<string>` you could create it like this:

```typescript
import { Validator, FormControlState } from 'ngrx-clean-forms';

const required: Validator<string> = (control: FormControlState<string>) =>
    control.value.trim().length ? null : { required: true };
```

To add it to a control inside your `FormGroup` you can now simply add it to the initialization array of a single control:

```typescript
import { initFormGroup } from 'ngrx-clean-forms';

export const initialState: ExampleState = {
    group: initFormGroup<ExampleFormControls>({
        textInput: ['', [required]],
        ..
    }),
};
```

### Using the Angular forms validators

Angular already provides a lot of validators that can be converted and used with this module.

The method `validatorOf<T>(fn: ValidatorFn): Validator<T>` converts a ReactiveForm validator to one that matches the specification of this library. Asynchronous validator functions (like `composeAsync`) are **not** usable.

```typescript
import { initFormGroup, validatorOf } from 'ngrx-clean-forms';
import { Validators } from '@angular/forms';

export const initialState: ExampleState = {
    group: initFormGroup({
        numberInput: [0, [validatorOf(Validators.max(4))]],
        ..
    }),
};
```

### Adding custom (state based) validation

There are scenarios where a simple validation of a control isn't enough. The validation of a control (or group) can depend on external state / attributes. Therefore the `getFormGroupSummary` and `getFormControlSummary` are able to receive multiple additional errors, which will be added to the existing errors.

An example validating a number against a variable in the state. This can be also found in the example application:

```typescript
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

This variant of validation should only be used, when the `validators` array isn't enough.

### Displaying errors (CSS classes)

This library utilizes the same error classes as angular. Excerpt from the Angular [documentation](https://angular.io/guide/form-validation#control-status-css-classes):

-   `.ng-valid`
-   `.ng-invalid`
-   ~~`.ng-pending`~~
-   `.ng-pristine`
-   `.ng-dirty`
-   `.ng-untouched`
-   `.ng-touched`

Those classes will be automatically assigned to the controls and forms managed by this library.

### Displaying errors (values)

The errors of form groups and controls are accessible by using the `FormGroupSummary` and `FormControlSummary`.

This snippet from the example app displays the error, if it is set. Regular applications would have probably an error message inside the `<small>`.

```html
<form ngrxForm [formSummary$]="formGroup$" (formUpdate)="updateFormGroup($event)">
    <div>
        <input type="number" ngrxControl="numberInput" />
        <small *ngIf="(formGroup$ | async)?.errors?.numberInput">
            {{ (formGroup$ | async).errors.numberInput | json }}
        </small>
    </div>
</form>
```

### Binding to custom input components

The workflow for adding support to your custom support is the same as for vanilla Angular forms. You'll simply have to implement the [ControlValueAccessor](https://angular.io/api/forms/ControlValueAccessor) interface.

You can also have a look at the `CustomInputComponent` inside the example application of this repository, which shows a simple example implementation.

### Binding to an input without a form

To bind to a input which is not contained in a form you'll have to complete the same steps as for a form. There are methods available for performing the same task just for a single input:

-   `initFormControl()` for initialization
-   `reduceFormControl()` for updating the control
-   `getFormControlSummary()` for retrieving the summary

Inside your template you can then bind the single input:

```html
<input ngrxControl [controlSummary$]="singleInput$" (controlUpdate)="updateSingleInput($event)" />
```

### Binding multiple HTML forms to the same state

It's possible without any restrictions. The example app shows an example under the headline _duplicate form_. (The value type of the form controls must still match with the types defined in your type definition.)

### Disabling forms / Setting disabled

To disable a form in the initial state you can simply use `initFormControl` or `initFormGroup` methods. You'll need to use the object initialization instead of the array one:

```typescript
initFormGroup({
    textInput: { value: '', disabled: true },
});
```

Disabling and enabling forms later can be done by using `FormControlUpdate` or `FormGroupUpdate`. Other attributes, like `untouched` and `pristine`, can also be updated these ways.

## Not yet supported features

| Feature                  | Status               | Description                                                                                                                                                                                          |
| ------------------------ | -------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Support `disabled`       | Implemented in 2.0.0 | Support the disabled attribute inside FormControls.                                                                                                                                                  |
| Async validators         | -                    |  Support the implemenation of async validators, which have side effects. _Can currently be implemented using the `additionalErrors` parameter of `getFormGroupSummary` and `getFormControlSummary`._ |
| `<input type="radio" />` | -                    | Support the usage of radio control groups. \*                                                                                                                                                        |
| `<select>`               | -                    | Support the usage of the basic `select` html tag. \*                                                                                                                                                 |
| `<select multiple>`      | -                    | Support the usage of the `multiple` attribute within the `select` tag. \*                                                                                                                            |

\*For now you can create a [custom component](b#inding-to-custom-input-components), which wraps the unsupported group.
