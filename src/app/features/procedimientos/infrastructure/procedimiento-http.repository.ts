import { Injectable } from '@angular/core';
import { CatalogoHttpRepository } from '../../../shared/catalogo/catalogo-http.repository';
import { Procedimiento } from '../domain/procedimiento';
import { ProcedimientoRepository } from '../domain/procedimiento.repository';

@Injectable()
export class ProcedimientoHttpRepository
  extends CatalogoHttpRepository<Procedimiento>
  implements ProcedimientoRepository
{
  protected readonly recurso = 'procedimientos';
}
