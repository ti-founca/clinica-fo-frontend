import { Provider } from '@angular/core';
import { PacienteRepository } from './domain/paciente.repository';
import { PacienteHttpRepository } from './infrastructure/paciente-http.repository';

/** Enlaza el puerto del dominio con su adaptador HTTP. */
export function providePacientes(): Provider[] {
  return [{ provide: PacienteRepository, useClass: PacienteHttpRepository }];
}
