import { AbstractControlDirective, CONTROL_DIRECTIVE_SELECTOR } from './abstract-control.directive';
import { HostListener, Directive } from '@angular/core';

@Directive({
    // tslint:disable-next-line: max-line-length
    selector: `input[type="text"][${CONTROL_DIRECTIVE_SELECTOR}],textarea[${CONTROL_DIRECTIVE_SELECTOR}],input:not([type="checkbox"]):not([type="number"]):not([type="range"])[${CONTROL_DIRECTIVE_SELECTOR}]`,
})
export class TextInputControlDirective extends AbstractControlDirective<string> {
    @HostListener('input') onInput() {
        this.emitValue(this.ref.nativeElement.value);
    }

    @HostListener('blur') onBlur() {
        this.emitTouched();
    }

    setValue(value: string) {
        this.r2.setProperty(this.ref.nativeElement, 'value', value);
    }
}
