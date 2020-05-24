---
id: configuration
title: Configuration
---

### Additional configuration and throttling

You can provide an additional configuration to the `NgrxFormsModule` using the `.withConfig()` method:

```typescript
import { NgrxCleanFormsModule } from 'ngrx-clean-forms';

NgrxCleanFormsModule.withConfig({
    throttleTime: 15,
}),
```

The following config attributes can be passed:

-   `throttleTime`: Number of how many milliseconds needs to pass between individual updates of a `FormControl`. There is no delay on the first update and also always an update after the delay. **Default:** `15`.
-   `distinctWritesOnly`: Specifies whether only distinct values should be written to a `FormControl`. Only applies to custom inputs added with `ControlValueAccessor`. Prevents update loops and uses `JSON.stringfy()` for comparison. **Default:** `true`.

The configuration for an individual `FormControl` can also be overridden with the `[controlConfig]` input:

```ts
<input
    type="range"
    ngrxFormControl="rangeInput"
    [controlConfig]="{ throttleTime: 500 }"
/>
```
