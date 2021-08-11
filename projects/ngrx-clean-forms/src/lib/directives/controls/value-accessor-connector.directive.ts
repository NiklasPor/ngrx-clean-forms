import { Directive, ElementRef, Inject, Optional, Renderer2 } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CONFIG_TOKEN } from '../../config';
import { FormsConfig } from '../../types';
import { AbstractControlDirective, CONTROL_DIRECTIVE_SELECTOR } from './abstract-control.directive';

@Directive({
    selector: `[${CONTROL_DIRECTIVE_SELECTOR}]:not(input):not(textarea):not(select)`,
    providers: [
        {
            provide: AbstractControlDirective,
            useExisting: ValueAccessorConnectorDirective,
        },
    ],
})
export class ValueAccessorConnectorDirective extends AbstractControlDirective<any> {
    accessor: ControlValueAccessor;
    lastValue: any;

    constructor(
        ref: ElementRef,
        r2: Renderer2,
        @Inject(CONFIG_TOKEN) config: FormsConfig,
        @Optional()
        @Inject(NG_VALUE_ACCESSOR)
        accessors: ControlValueAccessor[]
    ) {
        super(ref, r2, config);
        this.initAccessor(accessors);
    }

    initAccessor(accessors: ControlValueAccessor[]) {
        if (!accessors || !accessors.length) {
            return;
        }

        this.accessor = accessors[0];
        this.accessor.registerOnChange((val) => super.emitValue(val));
        this.accessor.registerOnTouched(() => super.emitTouched());
    }

    getValue() {
        return this.lastValue;
    }

    setValue(value: any) {
        if (!this.accessor) {
            return;
        }

        this.accessor.writeValue(value);
        this.lastValue = value;
    }

    setDisabled(disabled: boolean) {
        if (this.accessor && this.accessor.setDisabledState) {
            this.accessor.setDisabledState(disabled);
        }
    }
}
