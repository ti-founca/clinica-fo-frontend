import { Injectable, inject } from '@angular/core';
import { CatalogoStore } from '../../../shared/catalogo/catalogo.store';
import { Procedimiento } from '../domain/procedimiento';
import { ProcedimientoRepository } from '../domain/procedimiento.repository';

/** Catálogo global de procedimientos (se usa también al registrar tratamientos). */
@Injectable({ providedIn: 'root' })
export class ProcedimientosStore extends CatalogoStore<Procedimiento> {
  constructor() {
    super(inject(ProcedimientoRepository));
  }
}
