import { Directive, ElementRef, HostListener, Renderer2, Inject } from '@angular/core';
import { AbstractControlDirective, CONTROL_DIRECTIVE_SELECTOR } from './abstract-control.directive';
import { CONFIG_TOKEN } from '../../config';
import { FormsConfig } from '../../types';
@Directive({
    selector: `input[type="range"][${CONTROL_DIRECTIVE_SELECTOR}]`,
    providers: [
        {
            provide: AbstractControlDirective,
            useExisting: RangeInputControlDirective,
        },
    ],
})
export class RangeInputControlDirective extends AbstractControlDirective<number> {
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
        this.r2.setProperty(this.ref.nativeElement, 'value', value);
    }

    setDisabled(disabled: boolean) {
        this.r2.setProperty(this.ref.nativeElement, 'disabled', disabled);
    }
}
