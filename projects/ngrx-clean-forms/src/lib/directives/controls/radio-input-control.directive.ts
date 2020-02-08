import { Directive, ElementRef, HostListener, Renderer2, Inject } from '@angular/core';
import { AbstractControlDirective, CONTROL_DIRECTIVE_SELECTOR } from './abstract-control.directive';
import { CONFIG_TOKEN } from '../../ngrx-clean-forms.module';
import { FormsConfig } from '../../types';

export const RadioControlNotSupported = Error(
    // tslint:disable-next-line: max-line-length
    `Radio inputs are not yet supported. If you need to use one consider wrapping it in a Component which implements the ControlValueAccessor interface.`
);

@Directive({
    selector: `input[type="radio"][${CONTROL_DIRECTIVE_SELECTOR}]`,
})
export class RadioInputControlDirective extends AbstractControlDirective<boolean> {
    constructor(ref: ElementRef, r2: Renderer2, @Inject(CONFIG_TOKEN) config: FormsConfig) {
        super(ref, r2, config);
    }

    setValue(value: boolean) {
        throw RadioControlNotSupported;
    }
}
