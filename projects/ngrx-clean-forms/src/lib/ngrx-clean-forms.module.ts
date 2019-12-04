import { CommonModule } from '@angular/common';
import { NgModule, Type } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { AbstractControlDirective } from './directives/controls/abstract-control.directive';
import { NumberInputControlDirective } from './directives/controls/number-input-control.directive';
import { TextInputControlDirective } from './directives/controls/text-input-control.directive';
import { ValueAccesorConnectorDirective } from './directives/controls/value-accesor-connector.directive';
import { FormGroupDirective } from './directives/group/form-group.directive';

const controlDirectives: Type<AbstractControlDirective<any>>[] = [
    TextInputControlDirective,
    NumberInputControlDirective,
    ValueAccesorConnectorDirective,
];

@NgModule({
    declarations: [FormGroupDirective, ...controlDirectives],
    imports: [CommonModule, ReactiveFormsModule],
    exports: [FormGroupDirective, ...controlDirectives],
})
export class NgrxCleanFormsModule {}
