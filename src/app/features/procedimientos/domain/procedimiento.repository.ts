import { CatalogoRepository } from '../../../shared/catalogo/elemento-catalogo';
import { Procedimiento } from './procedimiento';

/** Puerto de acceso a procedimientos; la implementación vive en `infrastructure`. */
export abstract class ProcedimientoRepository extends CatalogoRepository<Procedimiento> {}
