---
id: control-reset
title: Reset
---

Resetting a control will change all of its attributes back to the default defined in [initialization](control-initialization#update-initialization). Except for the following attributes, which will stay the same, even after the reset:

-   `initialValue` – can be overridden by passing a new `initialValue`
-   `validators`
-   `disabled`

#### Simple reset

```ts
import { resetFormControl } from 'ngrx-clean-forms';

resetFormControl(control);
```

#### Reset with new initial value

```ts
import { resetFormControl } from 'ngrx-clean-forms';

resetFormControl(control, 'newInitial');
```
