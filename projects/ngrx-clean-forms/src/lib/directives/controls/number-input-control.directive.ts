import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';
import { AbstractControlDirective, CONTROL_DIRECTIVE_SELECTOR } from './abstract-control.directive';
@Directive({
    selector: `input[type="number"][${CONTROL_DIRECTIVE_SELECTOR}]`,
})
export class NumberInputControlDirective extends AbstractControlDirective<number> {
    constructor(ref: ElementRef, r2: Renderer2) {
        super(ref, r2);
    }

    @HostListener('input', ['$event']) onChange($event: Event) {
        const value = ($event.target as HTMLInputElement).value;
        this.emitValue(value === '' ? null : parseFloat(value));
    }

    @HostListener('blur') onBlur() {
        this.emitTouched();
    }

    setValue(value: number) {
        this.r2.setProperty(this.ref.nativeElement, 'value', value === null ? '' : value);
    }
}
