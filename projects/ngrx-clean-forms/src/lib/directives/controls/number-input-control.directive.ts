import { Directive, ElementRef, HostListener, Renderer2, Inject } from '@angular/core';
import { AbstractControlDirective, CONTROL_DIRECTIVE_SELECTOR } from './abstract-control.directive';
import { FormsConfig } from '../../types';
import { CONFIG_TOKEN } from '../../ngrx-clean-forms.module';
@Directive({
    selector: `input[type="number"][${CONTROL_DIRECTIVE_SELECTOR}]`,
})
export class NumberInputControlDirective extends AbstractControlDirective<number> {
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
        this.r2.setProperty(this.ref.nativeElement, 'value', value === null ? '' : value);
    }

    setDisabled(disabled: boolean) {
        this.r2.setProperty(this.ref.nativeElement, 'disabled', disabled);
    }
}
