import { NgrxCleanFormsModule } from './ngrx-clean-forms.module';
import { TestBed } from '@angular/core/testing';
import { FormsConfig } from './types';
import { CONFIG_TOKEN, defaultConfig } from './config';
describe('NgrxCleanFormsModule', () => {
    it('can be created', async () => {
        const expected = defaultConfig;

        await TestBed.configureTestingModule({
            imports: [
                NgrxCleanFormsModule.withConfig({
                    distinctWritesOnly: expected.distinctWritesOnly,
                    throttleTime: expected.throttleTime,
                }),
            ],
        }).compileComponents();

        const result: FormsConfig = TestBed.get(CONFIG_TOKEN);

        expect(result).toEqual(expected);
    });

    it('can be created with config', async () => {
        const expected: FormsConfig = {
            throttleTime: 9123,
            distinctWritesOnly: false,
        };

        await TestBed.configureTestingModule({
            imports: [
                NgrxCleanFormsModule.withConfig({
                    distinctWritesOnly: expected.distinctWritesOnly,
                    throttleTime: expected.throttleTime,
                }),
            ],
        }).compileComponents();

        const result: FormsConfig = TestBed.get(CONFIG_TOKEN);

        expect(result).toEqual(expected);
    });
});
