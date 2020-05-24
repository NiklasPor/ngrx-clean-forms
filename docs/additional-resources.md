---
id: additional-resources
title: Additional Resources
---

> This is a gathering of additional resources and information on the framework. The docs are currently WIP. The content of this section will be refined and split into seperate sections.

## Displaying errors (values)

The errors of form groups and controls are accessible by using the `FormGroupSummary` and `FormControlSummary`.

This snippet from the example app displays the error, if it is set. Regular applications would have probably an error message inside the `<small>`.

```html
<form ngrxFormGroup [formSummary]="formGroup | async" (formUpdate)="updateFormGroup($event)">
    <div>
        <input type="number" ngrxFormControl="numberInput" />
        <small *ngIf="(formGroup$ | async)?.errors?.numberInput">
            {{ (formGroup$ | async).errors.numberInput | json }}
        </small>
    </div>
</form>
```

## Binding to an input without a form

To bind to a input which is not contained in a form you'll have to complete the same steps as for a form. There are methods available for performing the same task just for a single input:

-   `initFormControl()` for initialization
-   `reduceFormControl()` for updating the control
-   `getFormControlSummary()` for retrieving the summary

Inside your template you can then bind the single input:

```html
<input
    ngrxFormControl
    [controlSummary]="summary$ | async"
    (controlUpdate)="updateSingleInput($event)"
/>
```

## Binding multiple HTML forms to the same state

It's possible without any restrictions. The example app shows an example under the headline _duplicate form_. (The value type of the form controls must still match with the types defined in your type definition.)

## Disabling forms / Setting disabled

To disable a form in the initial state you can simply use `initFormControl` or `initFormGroup` methods. You'll need to use the object initialization instead of the array one:

```typescript
initFormGroup({
    textInput: { value: '', disabled: true },
});
```

Disabling and enabling forms later can be done by using `FormControlUpdate` or `FormGroupUpdate`. Other attributes, like `untouched` and `pristine`, can also be updated these ways.

## Utilizing FormArrays

A FormArray is a simple array of controls. All of its controls are of the same type.

**Initialization:**

```typescript
initFormArray([['first'], ['second']]);
```

**Summary:**

```typescript
getFormArraySummary(state.array))
```

**Updating / Reducing:**

```typescript
reduceFormArray(state.array, update);
```

**Binding inside the template:**

```html
<form ngrxFormArray [formSummary]="formArray | async" (formUpdate)="updateFormArray($event)">
    <input *ngFor="let key of (formArray$ | async).keys" [ngrxFormControl]="key" type="text" />
</form>
```
