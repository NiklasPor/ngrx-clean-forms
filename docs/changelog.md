---
id: changelog
title: Changelog
---

## 5.0.1

**Fixed Bugs:**

-   Fixes #36: Removing controls from arrays can throw errors.
    -   Additionally improved handling of unknown control keys. Errors now indicate the misspelled control.

## 5.0.0

**New features:**

-   Added group & array validators.
-   Improved documentation.
    -   Partly restructrured, still WIP.
    -   Content for dynamically adding & removing controls to FormArrays were added.

**Breaking changes:**

-   `fast-equals` is now a **direct** dependency instead of a peer-dependency. Therefore it should be removed from your package.json, if you're not using it elsewhere.
-   Angular version support starts now at `^9.0.0`.
-   Writes now only occur if the value of an input differs from the value that will be written. This can be turned off by adjusting `distinctWritesOnly` inside the config.

**Fixed Bugs:**

-   Fixes #32: Editing inside Safari caused the cursor to jump.

## 4.4.0

**New features:**

-   `initFormControl` (and also `initFormGroup` and `initFormArray`) now support a third parameter: `disabled`. The parameter is optional and defaults to `false`.
-   `resetFormControl` resets a `FormControlState` to the original values. Detailed behaviour is described in the documentation. `resetFormGroup` and `resetFormArray` function analogously.

## 4.3.0

**New features:**

-   Every `FormControlState` now supports the `initialValue` property. It is set automatically when creating with one of the provided initializer functions.
-   Every `FormControlSummary` now additional supports the `changed` property. It is set to true when `initialValue` and `value` are different. For object comparison again [fast-equals](https://www.npmjs.com/package/fast-equals) was used.
    -   CSS class `.ng-changed` is now set on inputs when `changed: true`.
    -   CSS class `.ng-initial` is now set on inputs when `changed: false`.
-   `FormGroupSummary` and `FormGroupArray` also support the `changed` property. It is set when atleast one control was changed.

## 4.2.0

**New features:**

-   `distinctWritesOnly` now supports circular objects. Also the comparison performance has greatly increased with the use of [fast-equals](https://www.npmjs.com/package/fast-equals).

## 4.1.0

**New features:**

-   `validatorOf()` can now receive **multiple** Angular validators. Internally uses `Validators.compose` from `@angular/forms`.

## 4.0.0

**Breaking Changes:**

-   Renamed `ngrxControl` directive to `ngrxFormControl`.
-   Directive input `formSummary$` was changed to `formSummary` and now receives the summary instead of an Observable.
    -   Migration: Replace `[formSummary$]="form$"` with `[formSummary]="form$ | async"`
-   Directive input `controlSummary$` was changed to `controlSummary`.
    -   **Migration:** Replace `[controlSummary$]="control$"` with `[controlSummary]="control$ | async`.
-   Reduced public available API.
-   Renamed `mapFormControlStates()` to `mapFormGroupControlStates()`.
-   Renamed `mapFormControlUpdates()` to `mapFormGroupControlUpdates()`.
-   Renamed `mapFormControlSummaries()` to `mapFormGroupControlSummaries()`.

## 3.1.0

**New features:**

-   `NgrxCleanFormsModule.withConfig()` method for passing a config.
-   `ngrxFormControl` now supports the additional input`[controlConfig]="{..}` for passing a overriding config.
-   `throttleTime` config parameter for passing the value outputs of every `FormControl`. No data is lost while throttling.
-   `distinctWritesOnly` config parameter for disabling the distinct write value checks. This only applies to custom inputs.
