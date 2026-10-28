import { Provider } from '@angular/core';
import { ProcedimientoRepository } from './domain/procedimiento.repository';
import { ProcedimientoHttpRepository } from './infrastructure/procedimiento-http.repository';

/** Enlaza el puerto del dominio con su adaptador HTTP. */
export function provideProcedimientos(): Provider[] {
  return [{ provide: ProcedimientoRepository, useClass: ProcedimientoHttpRepository }];
}
