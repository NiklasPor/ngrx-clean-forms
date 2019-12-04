import { AbstractControlDirective, CONTROL_DIRECTIVE_SELECTOR } from './abstract-control.directive';
import { HostListener, Directive } from '@angular/core';

@Directive({
    selector: `input[type="checkbox"][${CONTROL_DIRECTIVE_SELECTOR}]`,
})
export class CheckboxInputControlDirective extends AbstractControlDirective<string> {
    @HostListener('input') onInput() {
        this.emitValue(this.ref.nativeElement.checked);
    }

    @HostListener('blur') onBlur() {
        this.emitTouched();
    }

    setValue(value: string) {
        this.ref.nativeElement.value = value;
    }
}
