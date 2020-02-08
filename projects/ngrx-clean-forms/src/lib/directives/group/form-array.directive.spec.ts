import { FormArrayDirective } from './form-array.directive';
import { FormControlUpdate, FormArrayUpdate } from '../../types';
describe('FormArrayDirective', () => {
    let directive: FormArrayDirective;
    let controlUpdate: FormControlUpdate<any>;
    let formUpdateSpy: any;

    beforeEach(() => {
        directive = new FormArrayDirective();

        controlUpdate = {
            value: 'nextValue',
        };

        formUpdateSpy = spyOn(directive.formUpdate, 'next');
    });

    it('emitUpdate should assemble update correctly (number input): [,value,]', () => {
        const key = 1;

        directive.emitUpdate(controlUpdate, key);

        const expected: FormArrayUpdate<any> = {
            controls: [undefined, controlUpdate],
        };

        expect(formUpdateSpy).toHaveBeenCalledTimes(1);
        expect(formUpdateSpy).toHaveBeenCalledWith(expected);
    });

    it('emitUpdate should assemble update correctly (string input): [,value,]', () => {
        const key = '1';

        directive.emitUpdate(controlUpdate, key);

        const expected: FormArrayUpdate<any> = {
            controls: [undefined, controlUpdate],
        };

        expect(formUpdateSpy).toHaveBeenCalledTimes(1);
        expect(formUpdateSpy).toHaveBeenCalledWith(expected);
    });

    it('emitUpdate should assemble update correctly (string input): [value]', () => {
        const key = '0';

        directive.emitUpdate(controlUpdate, key);

        const expected: FormArrayUpdate<any> = {
            controls: [controlUpdate],
        };

        expect(formUpdateSpy).toHaveBeenCalledTimes(1);
        expect(formUpdateSpy).toHaveBeenCalledWith(expected);
    });
});
