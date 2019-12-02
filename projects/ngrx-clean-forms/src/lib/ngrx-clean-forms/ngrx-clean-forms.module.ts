import { NgModule, Type } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControlDirective } from '../directives/controls/abstract-control.directive';
import { FormGroupDirective } from '../directives/group/form-group.directive';
import { TextInputControlDirective } from '../directives/controls/text-input-control.directive';
import { NumberInputControlDirective } from '../directives/controls/number-input-control.directive';

const controlDirectives: Type<AbstractControlDirective<any>>[] = [
    TextInputControlDirective,
    NumberInputControlDirective,
];

@NgModule({
    declarations: [FormGroupDirective, ...controlDirectives],
    imports: [CommonModule],
    exports: [FormGroupDirective, ...controlDirectives],
})
export class NgrxCleanFormsModule {}
