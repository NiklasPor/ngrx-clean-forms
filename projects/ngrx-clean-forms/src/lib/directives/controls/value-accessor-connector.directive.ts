import { Directive, ElementRef, Inject, Optional, Renderer2 } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { AbstractControlDirective, CONTROL_DIRECTIVE_SELECTOR } from './abstract-control.directive';
import { CONFIG_TOKEN } from '../../ngrx-clean-forms.module';
import { FormsConfig } from '../../types';

@Directive({
    selector: `[${CONTROL_DIRECTIVE_SELECTOR}]`,
})
export class ValueAccessorConnectorDirective extends AbstractControlDirective<any> {
    accessor: ControlValueAccessor;

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
        this.accessor.registerOnChange(val => super.emitValue(val));
        this.accessor.registerOnTouched(() => super.emitTouched());
    }

    setValue(value: number) {
        if (this.accessor) {
            this.accessor.writeValue(value);
        }
    }

    setDisabled(disabled: boolean) {
        if (this.accessor && this.accessor.setDisabledState) {
            this.accessor.setDisabledState(disabled);
        }
    }
}
