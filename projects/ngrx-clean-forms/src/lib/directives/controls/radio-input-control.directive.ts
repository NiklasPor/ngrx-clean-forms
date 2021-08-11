import { Directive, ElementRef, HostListener, Renderer2, Inject } from '@angular/core';
import { AbstractControlDirective, CONTROL_DIRECTIVE_SELECTOR } from './abstract-control.directive';
import { CONFIG_TOKEN } from '../../config';
import { FormsConfig } from '../../types';

export const RadioControlNotSupported = Error(
    // tslint:disable-next-line: max-line-length
    `Radio inputs are not yet supported. If you need to use one consider wrapping it in a Component which implements the ControlValueAccessor interface.`
);

@Directive({
    selector: `input[type="radio"][${CONTROL_DIRECTIVE_SELECTOR}]`,
    providers: [
        {
            provide: AbstractControlDirective,
            useExisting: RadioInputControlDirective,
        },
    ],
})
export class RadioInputControlDirective extends AbstractControlDirective<boolean> {
    constructor(ref: ElementRef, r2: Renderer2, @Inject(CONFIG_TOKEN) config: FormsConfig) {
        super(ref, r2, config);

        throw RadioControlNotSupported;
    }

    setValue(value: boolean) {}

    getValue() {
        return null;
    }
}
