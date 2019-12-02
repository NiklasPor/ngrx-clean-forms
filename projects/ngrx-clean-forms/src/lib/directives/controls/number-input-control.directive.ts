import { HostListener, Directive } from '@angular/core';
import { AbstractControlDirective } from './abstract-control.directive';

@Directive({
    selector: 'input[type="number"][libSingleControl]',
})
export class NumberInputControlDirective extends AbstractControlDirective<number> {
    @HostListener('input') onChange() {
        this.emitValue(this.ref.nativeElement.value);
    }

    @HostListener('blur') onBlur() {
        this.emitTouched();
    }

    setValue(value: number) {
        this.ref.nativeElement.value = value;
    }
}
