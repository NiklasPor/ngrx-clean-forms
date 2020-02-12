---
id: status
title: Status
---

## FormControlState

The following attributes are available in the `FormControlState`. `FormControlSummary` is an extension of `FormControlState` and therefore also provides these.

### Disabled

Disabled marks whether a control is enabled or not. When `disabled: true` the control will be marked as disabled. For custom components this is done using the `setDisabledState`method of the [ControlValueAccessor](https://angular.io/api/forms/ControlValueAccessor) interface.

The default inputs are automatically marked as disabled, using the disabled HTML attribute.

### Untouched

Untouched marks whether a control was yet not visited. Its behaviour is identical to the one of Angular.

CSS classes:

-   `untouched: true` -> `ng-untouched`
-   `untouched: false` -> `ng-touched`

### Pristine

Pristine indicates whether the value of the was changed. Its behaviour is identical to the one of Angular. Keep in mind that changing `'A' -> 'B' -> 'A'` will still mark it as **not** pristine. Pristine will be set to `false` by every value a control emits.

CSS classes:

-   `pristine: true` -> `ng-pristine`
-   `pristine: false` -> `ng-dirty`

## FormControlSummary

The attributes in this chapter only depend on the state of a form. Therefore they are only available in the `FormControlSummary` and **not** in the `FormControlState`.

### Valid

Valid indicates whether **all** of the validators of the control returned `null`. A control is marked as invalid if atleast one validator returns an error.

CSS classes:

-   `valid: true` -> `ng-valid`
-   `valid: false` -> `ng-invalid`

### Changed

Changed is a status introduced in _ngrx-clean-forms_ which is not present in the default forms by Angular. It indicates whether the value of a control is different from the initial value.

Switching `'A' -> 'B' -> 'A'` will therefore still set `changed: false`. To reset _changed_ the intial value can be set to the same value as the current inside the `FormControlState`.

CSS classes:

-   `changed: true` -> `ng-changed`
-   `initial: false` -> `ng-initial`
