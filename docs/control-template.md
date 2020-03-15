---
id: control-template
title: Template Binding
---

To bind a `NgrxFormControl` to the actual HTML template the `[controlSummary]` input and `(controlUpdate)` event can be used. The following example binds the control to `singleInput$`, which is a selector of a `FormControlSummary`.

```html
<input
    ngrxFormControl
    [controlSummary]="singleInput$ | async"
    (controlUpdate)="updateSingleInput($event)"
/>
```

Accordingly the component logic could look like this:

```ts
singleInput$ = this.store.select(ExampleSelectors.selectSingleInput);

constructor(private store: Store<AppState>) {}

updateSingleInput(controlUpdate: FormControlUpdate<string>) {
    this.store.dispatch(ExampleActions.updateSingleFormControl({ update: controlUpdate }));
}
```
