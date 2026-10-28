import { Observable } from 'rxjs';

/** Registro de un catálogo simple del backend (procedimientos, materias): solo tiene descripción. */
export interface ElementoCatalogo {
  id: number;
  descripcion: string;
}

/** Datos para registrar o actualizar un elemento del catálogo. */
export type ElementoCatalogoDatos = Omit<ElementoCatalogo, 'id'>;

/** Mismo orden que devuelve el backend: por descripción. */
export const compararPorDescripcion = (a: ElementoCatalogo, b: ElementoCatalogo) =>
  a.descripcion.localeCompare(b.descripcion);

/** Puerto genérico de acceso a un catálogo; cada slice lo especializa con su propio token. */
export abstract class CatalogoRepository<T extends ElementoCatalogo> {
  abstract listar(): Observable<T[]>;
  abstract obtener(id: number): Observable<T>;
  abstract crear(datos: ElementoCatalogoDatos): Observable<T>;
  abstract actualizar(id: number, datos: ElementoCatalogoDatos): Observable<T>;
  abstract eliminar(id: number): Observable<void>;
}
