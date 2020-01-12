import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { controlDirectives } from './directives/controls/control-directives';
import { FormGroupDirective } from './directives/group/form-group.directive';

@NgModule({
    declarations: [FormGroupDirective, ...controlDirectives],
    imports: [CommonModule],
    exports: [FormGroupDirective, ...controlDirectives],
})
export class NgrxCleanFormsModule {}
