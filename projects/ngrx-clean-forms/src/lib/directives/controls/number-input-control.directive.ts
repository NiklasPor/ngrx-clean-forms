import { HostListener, Directive } from '@angular/core';
import { AbstractControlDirective, CONTROL_DIRECTIVE_SELECTOR } from './abstract-control.directive';
@Directive({
    selector: `input[type="number"][${CONTROL_DIRECTIVE_SELECTOR}]`,
})
export class NumberInputControlDirective extends AbstractControlDirective<number> {
    @HostListener('input') onChange() {
        this.emitValue(this.ref.nativeElement.value);
    }

    @HostListener('blur') onBlur() {
        this.emitTouched();
    }

    setValue(value: number) {
        this.ref.nativeElement.value = value;
    }
}
