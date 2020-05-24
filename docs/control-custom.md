---
id: control-custom
title: Custom Components
---

The addition of custom components follows the same workflow as in Angular Forms. The component (or directive) simply has to implement the [ControlValueAccessor](https://angular.io/api/forms/ControlValueAccessor) interface and must provide an instance of the `NG_VALUE_ACCESSOR` token.

```ts
@Component({
    selector: 'app-custom-input',
    templateUrl: './custom-input.component.html',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => CustomInputComponent),
            multi: true,
        },
    ],
})
export class CustomInputComponent implements ControlValueAccessor {
    // implementation of the interfaces here
}
```

After the successful setup of the component it can be included like any other input inside the template. For example inside a form group:

```html
<form ngrxFormGroup [formSummary]="formGroup$ | async" (formUpdate)="updateFormGroup($event)">
    <app-custom-input ngrxFormControl="myCustomInput"></app-custom-input>
</form>
```

> A complete implementation of a custom component can also be found inside the example application of this repository. The class name of the component is `CustomInputComponent`.
