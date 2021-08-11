import { Directive, ElementRef, HostListener, Renderer2, Inject } from '@angular/core';
import { AbstractControlDirective, CONTROL_DIRECTIVE_SELECTOR } from './abstract-control.directive';
import { CONFIG_TOKEN } from '../../config';
import { FormsConfig } from '../../types';

export const SelectControlNotSupported = Error(
    // tslint:disable-next-line: max-line-length
    `Select inputs are not yet supported. If you need to use one consider wrapping it in a Component which implements the ControlValueAccessor interface.`
);

@Directive({
    selector: `select[${CONTROL_DIRECTIVE_SELECTOR}]`,
    providers: [
        {
            provide: AbstractControlDirective,
            useExisting: SelectInputControlDirective,
        },
    ],
})
export class SelectInputControlDirective extends AbstractControlDirective<boolean> {
    constructor(ref: ElementRef, r2: Renderer2, @Inject(CONFIG_TOKEN) config: FormsConfig) {
        super(ref, r2, config);

        throw SelectControlNotSupported;
    }

    setValue(value: boolean) {}

    getValue() {
        return null;
    }
}
