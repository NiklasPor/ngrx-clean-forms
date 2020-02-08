import { InjectionToken } from '@angular/core';
import { asyncScheduler } from 'rxjs';
import { throttleTime } from 'rxjs/operators';
import { FormsConfig } from './types';

export const CONFIG_TOKEN = new InjectionToken<FormsConfig>('NGRX_CLEAN_FORMS_CONFIG');

export const defaultConfig: FormsConfig = {
    throttleTime: 20,
};

export const throttle = (config: FormsConfig) =>
    throttleTime(config.throttleTime, asyncScheduler, {
        leading: true,
        trailing: true,
    });
