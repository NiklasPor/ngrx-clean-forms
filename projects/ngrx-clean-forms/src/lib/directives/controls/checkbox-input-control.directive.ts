import { AbstractControlDirective, CONTROL_DIRECTIVE_SELECTOR } from './abstract-control.directive';
import { HostListener, Directive } from '@angular/core';

@Directive({
    selector: `input[type="checkbox"][${CONTROL_DIRECTIVE_SELECTOR}]`,
})
export class CheckboxInputControlDirective extends AbstractControlDirective<boolean> {
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
