import { Directive } from '@angular/core';
import { FormArraySummary, FormControlUpdate } from '../../types';
import { FormArrayUpdate } from './../../types';
import { AbstractFormDirective } from './abstract-form.directive';

@Directive({
    selector: '[ngrxFormArray]',
})
export class FormArrayDirective extends AbstractFormDirective<
    FormArraySummary<any>,
    FormArrayUpdate<any>
> {
    emitUpdate(update: FormControlUpdate<any>, key: string | number) {
        const index = parseInt(key.toString(), 10);
        const controls = new Array(index + 1);

        controls[index] = update;

        this.formUpdate.next({ controls });
    }
}
