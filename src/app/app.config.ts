import { registerLocaleData } from '@angular/common';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import es from '@angular/common/locales/es';
import {
  ApplicationConfig,
  LOCALE_ID,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { es as esDateFns } from 'date-fns/locale';
import { NZ_DATE_LOCALE, es_ES, provideNzI18n } from 'ng-zorro-antd/i18n';
import { provideNzIcons } from 'ng-zorro-antd/icon';
import { NzModalService } from 'ng-zorro-antd/modal';

import { routes } from './app.routes';
import { apiErrorInterceptor } from './core/http/api-error.interceptor';
import { provideMaterias } from './features/materias/materias.providers';
import { providePacientes } from './features/pacientes/pacientes.providers';
import { providePreconsultas } from './features/preconsultas/preconsultas.providers';
import { provideProcedimientos } from './features/procedimientos/procedimientos.providers';
import { provideTratamientos } from './features/tratamientos/tratamientos.providers';
import { icons } from './icons-provider';

registerLocaleData(es);

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(withFetch(), withInterceptors([apiErrorInterceptor])),
    provideNzIcons(icons),
    provideNzI18n(es_ES),
    // Con date-fns los date pickers interpretan correctamente las fechas tecleadas (dd/MM/yyyy).
    { provide: NZ_DATE_LOCALE, useValue: esDateFns },
    { provide: LOCALE_ID, useValue: 'es' },
    // NG-ZORRO lo provee en NzModalModule; se registra en la raíz para abrir los formularios en modal.
    NzModalService,
    // Adaptadores de infraestructura de cada vertical slice.
    providePacientes(),
    providePreconsultas(),
    provideTratamientos(),
    provideProcedimientos(),
    provideMaterias(),
  ],
};
