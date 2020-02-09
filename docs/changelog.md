---
id: changelog
title: Changelog
---

## 4.0.0

**Breaking Changes:**

-   Renamed `ngrxControl` directive to `ngrxFormControl``
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
