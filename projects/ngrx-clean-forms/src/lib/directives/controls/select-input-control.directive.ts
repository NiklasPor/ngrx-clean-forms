import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';
import { AbstractControlDirective, CONTROL_DIRECTIVE_SELECTOR } from './abstract-control.directive';

const SelectControlNotSupported = Error(
    // tslint:disable-next-line: max-line-length
    `Select inputs are not yet supported. If you need to use one consider wrapping it in a Component which implements the ControlValueAccessor interface.`
);

@Directive({
    selector: `select[${CONTROL_DIRECTIVE_SELECTOR}]`,
})
export class SelectInputControlDirective extends AbstractControlDirective<boolean> {
    constructor(ref: ElementRef, r2: Renderer2) {
        super(ref, r2);
        throw SelectControlNotSupported;
    }

    setValue(value: boolean) {
        throw SelectControlNotSupported;
    }
}
