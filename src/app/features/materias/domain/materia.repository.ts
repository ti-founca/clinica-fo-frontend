import { CatalogoRepository } from '../../../shared/catalogo/elemento-catalogo';
import { Materia } from './materia';

/** Puerto de acceso a materias; la implementación vive en `infrastructure`. */
export abstract class MateriaRepository extends CatalogoRepository<Materia> {}
