import { ContentChildren, QueryList, Directive } from '@angular/core';
import { AbstractControlDirective } from '../controls/abstract-control.directive';
import { NumberInputControlDirective } from './../controls/number-input-control.directive';
import { TextInputControlDirective } from './../controls/text-input-control.directive';
import { ValueAccessorConnectorDirective } from '../controls/value-accessor-connector.directive';
import { CheckboxInputControlDirective } from '../controls/checkbox-input-control.directive';
import { RangeInputControlDirective } from '../controls/range-input-control.directive';
import { RadioInputControlDirective } from '../controls/radio-input-control.directive';
import { SelectInputControlDirective } from '../controls/select-input-control.directive';
import { map, startWith } from 'rxjs/operators';
import { combineLatest } from 'rxjs';

type directiveQuery = QueryList<AbstractControlDirective<any>>;
@Directive()
export abstract class ControlChildrenDirective {
    @ContentChildren(TextInputControlDirective, { descendants: true })
    private textInputs: directiveQuery;

    @ContentChildren(CheckboxInputControlDirective, { descendants: true })
    private checkboxInputs: directiveQuery;

    @ContentChildren(NumberInputControlDirective, { descendants: true })
    private numberInputs: directiveQuery;

    @ContentChildren(RadioInputControlDirective, { descendants: true })
    private radioInputs: directiveQuery;

    @ContentChildren(RangeInputControlDirective, { descendants: true })
    private rangeInputs: directiveQuery;

    @ContentChildren(SelectInputControlDirective, { descendants: true })
    private selectInputs: directiveQuery;

    @ContentChildren(ValueAccessorConnectorDirective, { descendants: true })
    private customInputs: directiveQuery;

    protected getChildren() {
        const queries$ = [
            this.textInputs,
            this.numberInputs,
            this.radioInputs,
            this.rangeInputs,
            this.selectInputs,
            this.customInputs,
            this.checkboxInputs,
        ]
            .filter(Boolean)
            .map((query) => {
                return this.convertToObservable(query);
            });

        return combineLatest(queries$).pipe(
            map((queries) => queries.reduce((q1, q2) => [...q1, ...q2], []))
        );
    }

    private convertToObservable(query: directiveQuery) {
        return query.changes.pipe(
            map(() => query),
            startWith(query),
            map((list) => list.toArray())
        );
    }
}
