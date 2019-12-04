import {
    Directive,
    ElementRef,
    Inject,
    Renderer2,
    Optional,
    ChangeDetectorRef,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { AbstractControlDirective, CONTROL_DIRECTIVE_SELECTOR } from './abstract-control.directive';

@Directive({
    selector: `[${CONTROL_DIRECTIVE_SELECTOR}]`,
})
export class ValueAccessorConnectorDirective extends AbstractControlDirective<any> {
    accessor: ControlValueAccessor;

    constructor(
        ref: ElementRef,
        r2: Renderer2,
        cdr: ChangeDetectorRef,
        @Optional()
        @Inject(NG_VALUE_ACCESSOR)
        accessors: ControlValueAccessor[]
    ) {
        super(ref, r2, cdr);
        this.initAccessor(accessors);
    }

    initAccessor(accessors: ControlValueAccessor[]) {
        if (!accessors || !accessors.length) {
            return;
        }

        this.accessor = accessors[0];
        this.accessor.registerOnChange(val => super.emitValue(val));
        this.accessor.registerOnTouched(() => super.emitTouched());
    }

    setValue(value: number) {
        if (this.accessor) {
            this.accessor.writeValue(value);
        }
    }
}
