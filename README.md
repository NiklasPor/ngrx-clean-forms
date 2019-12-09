# ngrx-clean-forms

This library contains the necessary tools to integrate the form management into the general state management of an application. While this library was written with the usage of [NgRx](https://ngrx.io/docs) in mind, it has no dependency to it. Therefore it can also be used with other frameworks like [NgXs](https://www.ngxs.io/).

The focus of this library lies on:

-   Having a strict typing approach. Therefore the types of your forms will be available throughout the whole interaction with the state.
-   Providing validation errors as a transformation (selector) of the form state.
-   Keeping the data flow explicit and manageable.

## Table of Contents

-   [Getting Started](#getting-started)
    -   [Import the NgrxCleanFormsModule](#import-the-ngrxcleanformsmodule)
    -   [Add the form state to your state managment](#add-the-form-state-to-your-state-managment)
    -   [Accessing the form state & errors](#accessing-the-form-state---errors)
    -   [Updating (reducing) the form state](#updating--reducing--the-form-state)
    -   [Binding your HTML form to your state](#binding-your-html-form-to-your-state)
-   [Additional Resources](#additional-resources)
    -   [Adding validators](#adding-validators)
    -   [Using the Angular forms validators](#using-the-angular-forms-validators)
    -   [Displaying errors (CSS classes)](#displaying-errors--css-classes-)
    -   [Binding to custom input components](#binding-to-custom-input-components)
    -   [Binding to an input without a form](#binding-to-a-input-without-a-form)
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

In `NgRx` we'd create a `Action` supplying the data necessary for the state update.

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

The method `validatorOf<T>(fn: ValidatorFn): Validator<T>` converts an Angular validator to one that matches the specification of this library:

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

### Displaying errors (CSS classes)

This library utilizes the same error classes as angular. Excerpt from the Angular [documentation](https://angular.io/guide/form-validation#control-status-css-classes):

-   `.ng-valid`
-   `.ng-invalid`
-   `.ng-pending`
-   `.ng-pristine`
-   `.ng-dirty`
-   `.ng-untouched`
-   `.ng-touched`

Those classes will be automatically assigned to the controls and forms managed by this library.

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

## Not yet supported features

| Feature                  | Status | Description                                                              |
| ------------------------ | ------ | ------------------------------------------------------------------------ |
| Support `disabled`       | WIP    | Support the disabled attribute inside FormControls.                      |
| Async validators         | -      |  Support the implemenation of async validators, which have side effects. |
| `<input type="radio" />` | -      | Support the usage of radio control groups.                               |
