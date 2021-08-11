import { ContentChildren, QueryList, Directive } from '@angular/core';
import { AbstractControlDirective } from '../controls/abstract-control.directive';
import { map, startWith } from 'rxjs/operators';

type directiveQuery = QueryList<AbstractControlDirective>;
@Directive()
export abstract class ControlChildrenDirective {
    @ContentChildren(AbstractControlDirective, { descendants: true })
    private abstractInputs: directiveQuery;

    protected getChildren() {
        return this.convertToObservable(this.abstractInputs);
    }

    private convertToObservable(query: directiveQuery) {
        return query.changes.pipe(
            map(() => query),
            startWith(query),
            map((list) => list.toArray())
        );
    }
}
