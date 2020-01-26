import { AbstractFormDirective } from './abstract-form.directive';
import { FormGroupSummary, FormGroupUpdate, FormControlUpdate } from '../../types';
import { Directive } from '@angular/core';

@Directive({
    selector: '[ngrxFormGroup]',
})
export class FormGroupDirective extends AbstractFormDirective<
    FormGroupSummary<any>,
    FormGroupUpdate<any>
> {
    emitUpdate(update: FormControlUpdate<any>, key: string) {
        this.formUpdate.next({ controls: { [key]: update } });
    }
}
