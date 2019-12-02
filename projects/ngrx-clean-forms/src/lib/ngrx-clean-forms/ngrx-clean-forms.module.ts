import { NgModule, Type } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SingleControlDirective } from '../single-control.directive';
import { FormGroupDirective } from '../form-group.directive';
import { InputControlDirective } from '../input-control.directive';

const controlDirectives: Type<SingleControlDirective<any>>[] = [InputControlDirective];

@NgModule({
    declarations: [FormGroupDirective, ...controlDirectives],
    imports: [CommonModule],
    exports: [FormGroupDirective, ...controlDirectives],
})
export class NgrxCleanFormsModule {}
