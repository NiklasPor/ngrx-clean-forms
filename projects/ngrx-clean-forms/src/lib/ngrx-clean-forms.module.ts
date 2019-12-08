import { CheckboxInputControlDirective } from './directives/controls/checkbox-input-control.directive';
import { CommonModule } from '@angular/common';
import { NgModule, Type } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { AbstractControlDirective } from './directives/controls/abstract-control.directive';
import { NumberInputControlDirective } from './directives/controls/number-input-control.directive';
import { TextInputControlDirective } from './directives/controls/text-input-control.directive';
import { ValueAccessorConnectorDirective } from './directives/controls/value-accessor-connector.directive';
import { FormGroupDirective } from './directives/group/form-group.directive';
import { RangeInputControlDirective } from './directives/controls/range-input-control.directive';

const controlDirectives: Type<AbstractControlDirective<any>>[] = [
    TextInputControlDirective,
    CheckboxInputControlDirective,
    NumberInputControlDirective,
    RangeInputControlDirective,
    ValueAccessorConnectorDirective,
];

@NgModule({
    declarations: [FormGroupDirective, ...controlDirectives],
    imports: [CommonModule],
    exports: [FormGroupDirective, ...controlDirectives],
})
export class NgrxCleanFormsModule {}
