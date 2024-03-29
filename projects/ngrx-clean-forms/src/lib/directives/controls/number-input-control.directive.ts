import { Directive, ElementRef, HostListener, Renderer2, Inject } from '@angular/core';
import { AbstractControlDirective, CONTROL_DIRECTIVE_SELECTOR } from './abstract-control.directive';
import { FormsConfig } from '../../types';
import { CONFIG_TOKEN } from '../../config';
@Directive({
    selector: `input[type="number"][${CONTROL_DIRECTIVE_SELECTOR}]`,
    providers: [
        {
            provide: AbstractControlDirective,
            useExisting: NumberInputControlDirective,
        },
    ],
})
export class NumberInputControlDirective extends AbstractControlDirective<number> {
    constructor(ref: ElementRef, r2: Renderer2, @Inject(CONFIG_TOKEN) config: FormsConfig) {
        super(ref, r2, config);
    }

    @HostListener('input') onInput() {
        this.emitValue(this.getValue());
    }

    @HostListener('blur') onBlur() {
        this.emitTouched();
    }

    getValue() {
        const value = (this.ref.nativeElement as HTMLInputElement).value;
        return value === '' ? null : parseFloat(value);
    }

    setValue(value: number) {
        this.r2.setProperty(this.ref.nativeElement, 'value', value === null ? '' : value);
    }

    setDisabled(disabled: boolean) {
        this.r2.setProperty(this.ref.nativeElement, 'disabled', disabled);
    }
}
