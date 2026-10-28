import { Injectable, inject } from '@angular/core';
import { CatalogoStore } from '../../../shared/catalogo/catalogo.store';
import { Materia } from '../domain/materia';
import { MateriaRepository } from '../domain/materia.repository';

/** Catálogo global de materias (se usa también al registrar tratamientos). */
@Injectable({ providedIn: 'root' })
export class MateriasStore extends CatalogoStore<Materia> {
  constructor() {
    super(inject(MateriaRepository));
  }
}
