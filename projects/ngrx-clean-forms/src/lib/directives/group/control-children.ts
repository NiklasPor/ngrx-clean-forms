import { ContentChildren, QueryList } from '@angular/core';
import { AbstractControlDirective } from '../controls/abstract-control.directive';
import { NumberInputControlDirective } from './../controls/number-input-control.directive';
import { TextInputControlDirective } from './../controls/text-input-control.directive';

type directiveQuery = QueryList<AbstractControlDirective<any>>;
const config = { descendants: true };

export abstract class ControlChildren {
    @ContentChildren(TextInputControlDirective, config) private textInputs: directiveQuery;
    @ContentChildren(NumberInputControlDirective, config) private numberInputs: directiveQuery;

    protected getChildren() {
        return [this.textInputs, this.numberInputs]
            .filter(query => query !== undefined)
            .map(query => query.toArray())
            .reduce((q1, q2) => [...q1, ...q2], []);
    }
}
