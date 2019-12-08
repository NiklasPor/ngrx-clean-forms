import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';
import { AbstractControlDirective, CONTROL_DIRECTIVE_SELECTOR } from './abstract-control.directive';

@Directive({
    selector: `input[type="checkbox"][${CONTROL_DIRECTIVE_SELECTOR}]`,
})
export class CheckboxInputControlDirective extends AbstractControlDirective<boolean> {
    constructor(ref: ElementRef, r2: Renderer2) {
        super(ref, r2);
    }

    @HostListener('input', ['$event']) onInput($event: Event) {
        const checked = ($event.target as HTMLInputElement).checked;
        this.emitValue(checked);
    }

    @HostListener('blur') onBlur() {
        this.emitTouched();
    }

    setValue(value: boolean) {
        this.r2.setProperty(this.ref.nativeElement, 'checked', value);
    }
}
