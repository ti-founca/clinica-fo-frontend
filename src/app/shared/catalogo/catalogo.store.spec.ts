import { HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { CatalogoStore } from './catalogo.store';
import { CatalogoRepository, ElementoCatalogo, ElementoCatalogoDatos } from './elemento-catalogo';

class RepositorioFalso extends CatalogoRepository<ElementoCatalogo> {
  elementos: ElementoCatalogo[] = [{ id: 1, descripcion: 'Periodoncia' }];
  errorAlEliminar = false;

  listar(): Observable<ElementoCatalogo[]> {
    return of(this.elementos);
  }
  obtener(id: number): Observable<ElementoCatalogo> {
    return of(this.elementos.find((e) => e.id === id)!);
  }
  crear(datos: ElementoCatalogoDatos): Observable<ElementoCatalogo> {
    return of({ id: 2, ...datos });
  }
  actualizar(id: number, datos: ElementoCatalogoDatos): Observable<ElementoCatalogo> {
    return of({ id, ...datos });
  }
  eliminar(): Observable<void> {
    return this.errorAlEliminar
      ? throwError(() => new HttpErrorResponse({ status: 409 }))
      : of(undefined);
  }
}

class StoreDePrueba extends CatalogoStore<ElementoCatalogo> {}

describe('CatalogoStore', () => {
  let repo: RepositorioFalso;
  let store: StoreDePrueba;

  beforeEach(async () => {
    repo = new RepositorioFalso();
    store = new StoreDePrueba(repo);
    await store.cargar();
  });

  it('mantiene la lista ordenada por descripción al crear y actualizar', async () => {
    await store.crear({ descripcion: 'Endodoncia' });
    expect(store.elementos().map((e) => e.descripcion)).toEqual(['Endodoncia', 'Periodoncia']);

    await store.actualizar(1, { descripcion: 'Cirugía' });
    expect(store.elementos().map((e) => e.descripcion)).toEqual(['Cirugía', 'Endodoncia']);
    expect(store.porId().get(1)?.descripcion).toBe('Cirugía');
  });

  it('conserva el elemento si el backend rechaza la eliminación', async () => {
    repo.errorAlEliminar = true;
    await expect(store.eliminar(1)).rejects.toBeTruthy();
    expect(store.elementos()).toHaveLength(1);
  });
});
