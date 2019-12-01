import {
    Directive,
    ElementRef,
    Input,
    HostListener,
    EventEmitter,
    Output,
    OnChanges,
} from '@angular/core';
import { FormControlSummary, FormControlUpdate } from './types';
import { Observable } from 'rxjs';

@Directive({
    selector: '[libSingleControl]',
})
export class SingleControlDirective {
    @Input('formSummary$')
    set setFormSummary$(formSummary$: Observable<FormControlSummary<any>>) {
        this.formSummary$ = formSummary$;
        this.formSummary$.subscribe(summary => (this.ref.nativeElement.value = summary.value));
    }

    @Output() formUpdate = new EventEmitter<FormControlUpdate<any>>();

    formSummary$: Observable<FormControlSummary<any>>;

    constructor(private ref: ElementRef) {}

    @HostListener('input') onInput() {
        this.formUpdate.emit({ value: this.ref.nativeElement.value });
    }
}
