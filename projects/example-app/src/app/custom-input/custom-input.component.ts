import { Component, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

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
    value = 0;

    onChange: (val) => void;
    onTouched: () => void;

    writeValue(value: any): void {
        this.value = value;
        this.onChange(this.value);
    }

    registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    increment() {
        this.value++;

        if (this.onTouched) {
            this.onTouched();
        }

        if (this.onChange) {
            this.onChange(this.value);
        }
    }
}
