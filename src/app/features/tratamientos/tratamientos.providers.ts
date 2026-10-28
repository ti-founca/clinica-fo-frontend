import { Provider } from '@angular/core';
import { TratamientoRepository } from './domain/tratamiento.repository';
import { TratamientoHttpRepository } from './infrastructure/tratamiento-http.repository';

/** Enlaza el puerto del dominio con su adaptador HTTP. */
export function provideTratamientos(): Provider[] {
  return [{ provide: TratamientoRepository, useClass: TratamientoHttpRepository }];
}
