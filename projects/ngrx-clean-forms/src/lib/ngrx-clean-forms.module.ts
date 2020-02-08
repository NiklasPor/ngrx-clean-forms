import { CommonModule } from '@angular/common';
import { NgModule, ModuleWithProviders, InjectionToken } from '@angular/core';
import { controlDirectives } from './directives/controls/control-directives';
import { FormGroupDirective } from './directives/group/form-group.directive';
import { FormArrayDirective } from './directives/group/form-array.directive';
import { FormsConfig } from './types';

export const CONFIG_TOKEN = new InjectionToken<FormsConfig>('NGRX_CLEAN_FORMS_CONFIG');

const defaultConfig: FormsConfig = {
    throttleTime: 1000,
    distinctOnly: true,
};

/**
 * This module represents the entry point of ngrx-clean-forms.
 * It provides all necessary directives for the usage inside templates.
 *
 * - [npm](https://www.npmjs.com/package/ngrx-clean-forms)
 * - [documentation](https://github.com/NiklasPor/ngrx-clean-forms)
 */
@NgModule({
    declarations: [FormGroupDirective, FormArrayDirective, ...controlDirectives],
    imports: [CommonModule],
    exports: [FormGroupDirective, FormArrayDirective, ...controlDirectives],
    providers: [
        {
            provide: CONFIG_TOKEN,
            useValue: defaultConfig,
        },
    ],
})
export class NgrxCleanFormsModule {
    static withConfig(config: Partial<FormsConfig>): ModuleWithProviders {
        return {
            ngModule: NgrxCleanFormsModule,
            providers: [
                {
                    provide: CONFIG_TOKEN,
                    useValue: {
                        ...defaultConfig,
                        ...config,
                    } as FormsConfig,
                },
            ],
        };
    }
}
