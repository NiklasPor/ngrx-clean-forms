import { CommonModule } from '@angular/common';
import { NgModule, ModuleWithProviders, InjectionToken } from '@angular/core';
import { controlDirectives } from './directives/controls/control-directives';
import { FormGroupDirective } from './directives/group/form-group.directive';
import { FormArrayDirective } from './directives/group/form-array.directive';
import { FormsConfig } from './types';
import { defaultConfig, CONFIG_TOKEN } from './config';

/**
 * This module represents the entry point of ngrx-clean-forms.
 * It provides all necessary directives for the usage inside templates.
 *
 * The `.withConfig()` method can be used to pass a config to the module.
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
    /**
     * Creates a new module with the given config. Missing values will be set with default values.
     *
     * @param config A partial `FormsConfig` object, supplying config paramters.
     *
     * @example
     * NgrxCleanFormsModule.withConfig({
     *   throttleTime: 15,
     * }),
     *
     */
    static withConfig(config: Partial<FormsConfig>): ModuleWithProviders<NgrxCleanFormsModule> {
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
