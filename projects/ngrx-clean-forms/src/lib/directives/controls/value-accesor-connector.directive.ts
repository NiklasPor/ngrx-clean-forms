import { Directive, ElementRef, Inject, Renderer2, Optional } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { AbstractControlDirective } from './abstract-control.directive';

@Directive({
    selector: '[libSingleControl]',
})
export class ValueAccesorConnectorDirective extends AbstractControlDirective<number> {
    accessor: ControlValueAccessor;

    constructor(
        ref: ElementRef,
        r2: Renderer2,
        @Optional()
        @Inject(NG_VALUE_ACCESSOR)
        accessors: ControlValueAccessor[]
    ) {
        super(ref, r2);
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
