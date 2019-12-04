import { ContentChildren, QueryList } from '@angular/core';
import { AbstractControlDirective } from '../controls/abstract-control.directive';
import { NumberInputControlDirective } from './../controls/number-input-control.directive';
import { TextInputControlDirective } from './../controls/text-input-control.directive';
import { ValueAccessorConnectorDirective } from '../controls/value-accessor-connector.directive';
import { CheckboxInputControlDirective } from '../controls/checkbox-input-control.directive';
import { RangeInputControlDirective } from '../controls/range-input-control.directive';

type directiveQuery = QueryList<AbstractControlDirective<any>>;
const config = { descendants: true };

export abstract class ControlChildren {
    @ContentChildren(TextInputControlDirective, config) private textInputs: directiveQuery;
    @ContentChildren(CheckboxInputControlDirective, config) private checkboxInputs: directiveQuery;
    @ContentChildren(NumberInputControlDirective, config) private numberInputs: directiveQuery;
    @ContentChildren(RangeInputControlDirective, config) private rangeInputs: directiveQuery;
    @ContentChildren(ValueAccessorConnectorDirective, config) private customInputs: directiveQuery;

    protected getChildren() {
        return [
            this.textInputs,
            this.numberInputs,
            this.rangeInputs,
            this.customInputs,
            this.checkboxInputs,
        ]
            .filter(query => query !== undefined)
            .map(query => query.toArray())
            .reduce((q1, q2) => [...q1, ...q2], []);
    }
}
