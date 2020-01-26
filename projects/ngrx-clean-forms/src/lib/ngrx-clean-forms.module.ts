import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { controlDirectives } from './directives/controls/control-directives';
import { FormGroupDirective } from './directives/group/form-group.directive';
import { FormArrayDirective } from './directives/group/form-array.directive';

@NgModule({
    declarations: [FormGroupDirective, FormArrayDirective, ...controlDirectives],
    imports: [CommonModule],
    exports: [FormGroupDirective, FormArrayDirective, ...controlDirectives],
})
export class NgrxCleanFormsModule {}
