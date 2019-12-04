import { AbstractControlDirective, CONTROL_DIRECTIVE_SELECTOR } from './abstract-control.directive';
import { HostListener, Directive } from '@angular/core';

@Directive({
    selector: `input[type="checkbox"][${CONTROL_DIRECTIVE_SELECTOR}]`,
})
export class CheckboxInputControlDirective extends AbstractControlDirective<string> {
    @HostListener('input') onInput($event: Event) {
        const value = ($event.target as HTMLInputElement).value;
        this.emitValue(value);
    }

    @HostListener('blur') onBlur() {
        this.emitTouched();
    }

    setValue(value: string) {
        this.r2.setProperty(this.ref.nativeElement, 'checked', value);
    }
}
