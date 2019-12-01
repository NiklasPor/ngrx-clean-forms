import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SingleControlDirective } from '../single-control.directive';

@NgModule({
    declarations: [SingleControlDirective],
    imports: [CommonModule],
    exports: [SingleControlDirective],
})
export class NgrxCleanFormsModule {}
