import { SingleControlDirective } from './single-control.directive';
import { HostListener, Directive } from '@angular/core';

@Directive({
    selector: 'input[type="text"][libSingleControl]',
})
export class InputControlDirective extends SingleControlDirective<string> {
    @HostListener('input') onInput() {
        this.emitValue(this.ref.nativeElement.value);
    }

    @HostListener('blur') onBlur() {
        this.emitTouched();
    }

    setValue(value: string) {
        this.ref.nativeElement.value = value;
    }
}
