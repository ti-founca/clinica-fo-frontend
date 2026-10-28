import { Provider } from '@angular/core';
import { MateriaRepository } from './domain/materia.repository';
import { MateriaHttpRepository } from './infrastructure/materia-http.repository';

/** Enlaza el puerto del dominio con su adaptador HTTP. */
export function provideMaterias(): Provider[] {
  return [{ provide: MateriaRepository, useClass: MateriaHttpRepository }];
}
