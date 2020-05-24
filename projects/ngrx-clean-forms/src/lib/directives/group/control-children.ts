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
const config = { descendants: true };

@Directive()
export abstract class ControlChildren {
    @ContentChildren(TextInputControlDirective, config) private textInputs: directiveQuery;
    @ContentChildren(CheckboxInputControlDirective, config) private checkboxInputs: directiveQuery;
    @ContentChildren(NumberInputControlDirective, config) private numberInputs: directiveQuery;
    @ContentChildren(RadioInputControlDirective, config) private radioInputs: directiveQuery;
    @ContentChildren(RangeInputControlDirective, config) private rangeInputs: directiveQuery;
    @ContentChildren(SelectInputControlDirective, config) private selectInputs: directiveQuery;
    @ContentChildren(ValueAccessorConnectorDirective, config) private customInputs: directiveQuery;

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
            .map(query => {
                return this.convertToObservable(query);
            });

        return combineLatest(queries$).pipe(
            map(queries => queries.reduce((q1, q2) => [...q1, ...q2], []))
        );
    }

    private convertToObservable(query: directiveQuery) {
        return query.changes.pipe(
            map(() => query),
            startWith(query),
            map(list => list.toArray())
        );
    }
}
