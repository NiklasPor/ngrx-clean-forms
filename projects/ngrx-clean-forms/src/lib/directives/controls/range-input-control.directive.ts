import { Directive, ElementRef, HostListener, Renderer2, Inject } from '@angular/core';
import { AbstractControlDirective, CONTROL_DIRECTIVE_SELECTOR } from './abstract-control.directive';
import { CONFIG_TOKEN } from '../../ngrx-clean-forms.module';
import { FormsConfig } from '../../types';
@Directive({
    selector: `input[type="range"][${CONTROL_DIRECTIVE_SELECTOR}]`,
})
export class RangeInputControlDirective extends AbstractControlDirective<number> {
    constructor(ref: ElementRef, r2: Renderer2, @Inject(CONFIG_TOKEN) config: FormsConfig) {
        super(ref, r2, config);
    }

    @HostListener('input', ['$event']) onInput($event: Event) {
        const value = ($event.target as HTMLInputElement).value;
        this.emitValue(value === '' ? null : parseFloat(value));
    }

    @HostListener('blur') onBlur() {
        this.emitTouched();
    }

    setValue(value: number) {
        this.r2.setProperty(this.ref.nativeElement, 'value', value);
    }

    setDisabled(disabled: boolean) {
        this.r2.setProperty(this.ref.nativeElement, 'disabled', disabled);
    }
}
