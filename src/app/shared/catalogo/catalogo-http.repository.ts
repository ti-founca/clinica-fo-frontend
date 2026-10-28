import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URL } from '../../core/config/api-url';
import { CatalogoRepository, ElementoCatalogo, ElementoCatalogoDatos } from './elemento-catalogo';

/** Adaptador HTTP genérico para los endpoints CRUD `/api/{recurso}` de un catálogo. */
export abstract class CatalogoHttpRepository<
  T extends ElementoCatalogo,
> extends CatalogoRepository<T> {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = inject(API_URL);

  /** Segmento de la ruta del recurso, p. ej. `materias`. */
  protected abstract readonly recurso: string;

  private get url(): string {
    return `${this.apiUrl}/api/${this.recurso}`;
  }

  listar(): Observable<T[]> {
    return this.http.get<T[]>(this.url);
  }

  obtener(id: number): Observable<T> {
    return this.http.get<T>(`${this.url}/${id}`);
  }

  crear(datos: ElementoCatalogoDatos): Observable<T> {
    return this.http.post<T>(this.url, datos);
  }

  actualizar(id: number, datos: ElementoCatalogoDatos): Observable<T> {
    return this.http.put<T>(`${this.url}/${id}`, datos);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
