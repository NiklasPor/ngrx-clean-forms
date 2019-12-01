import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SingleControlDirective } from '../single-control.directive';
import { FormGroupDirective } from '../form-group.directive';

@NgModule({
    declarations: [SingleControlDirective, FormGroupDirective],
    imports: [CommonModule],
    exports: [SingleControlDirective, FormGroupDirective],
})
export class NgrxCleanFormsModule {}
