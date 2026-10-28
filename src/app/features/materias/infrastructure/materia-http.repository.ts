import { Injectable } from '@angular/core';
import { CatalogoHttpRepository } from '../../../shared/catalogo/catalogo-http.repository';
import { Materia } from '../domain/materia';
import { MateriaRepository } from '../domain/materia.repository';

@Injectable()
export class MateriaHttpRepository
  extends CatalogoHttpRepository<Materia>
  implements MateriaRepository
{
  protected readonly recurso = 'materias';
}
