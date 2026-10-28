import { Provider } from '@angular/core';
import { PreconsultaRepository } from './domain/preconsulta.repository';
import { PreconsultaHttpRepository } from './infrastructure/preconsulta-http.repository';

/** Enlaza el puerto del dominio con su adaptador HTTP. */
export function providePreconsultas(): Provider[] {
  return [{ provide: PreconsultaRepository, useClass: PreconsultaHttpRepository }];
}
