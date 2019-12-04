import { HostListener, Directive } from '@angular/core';
import { AbstractControlDirective, CONTROL_DIRECTIVE_SELECTOR } from './abstract-control.directive';
@Directive({
    selector: `input[type="range"][${CONTROL_DIRECTIVE_SELECTOR}]`,
})
export class RangeInputControlDirective extends AbstractControlDirective<number> {
    @HostListener('input', ['$event']) onChange($event: Event) {
        const value = ($event.target as HTMLInputElement).value;
        this.emitValue(value === '' ? null : parseFloat(value));
    }

    @HostListener('blur') onBlur() {
        this.emitTouched();
    }

    setValue(value: number) {
        this.r2.setProperty(this.ref.nativeElement, 'value', value);
    }
}
