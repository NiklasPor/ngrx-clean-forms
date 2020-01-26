import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';
import { AbstractControlDirective, CONTROL_DIRECTIVE_SELECTOR } from './abstract-control.directive';

@Directive({
    // tslint:disable-next-line: max-line-length
    selector: `input[type="text"][${CONTROL_DIRECTIVE_SELECTOR}],textarea[${CONTROL_DIRECTIVE_SELECTOR}],input:not([type="checkbox"]):not([type="number"]):not([type="range"]):not([type="radio"])[${CONTROL_DIRECTIVE_SELECTOR}]`,
})
export class TextInputControlDirective extends AbstractControlDirective<string> {
    constructor(ref: ElementRef, r2: Renderer2) {
        super(ref, r2);
    }

    @HostListener('input') onInput($event: Event) {
        console.log($event);
        const value = ($event.target as HTMLInputElement).value;
        this.emitValue(value);
    }

    @HostListener('blur') onBlur() {
        this.emitTouched();
    }

    setValue(value: string) {
        this.r2.setProperty(this.ref.nativeElement, 'value', value);
    }

    setDisabled(disabled: boolean) {
        this.r2.setProperty(this.ref.nativeElement, 'disabled', disabled);
    }
}
