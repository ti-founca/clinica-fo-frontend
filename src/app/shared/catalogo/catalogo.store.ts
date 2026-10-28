import { computed, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { aApiError } from '../../core/http/api-error';
import {
  CatalogoRepository,
  ElementoCatalogo,
  ElementoCatalogoDatos,
  compararPorDescripcion,
} from './elemento-catalogo';

/**
 * Estado de un catálogo basado en signals. Cada slice lo extiende con un store global
 * (`providedIn: 'root'`), ya que los catálogos se usan también para seleccionar y mostrar
 * datos en otras funcionalidades (tratamientos).
 */
export abstract class CatalogoStore<T extends ElementoCatalogo> {
  private readonly _elementos = signal<T[]>([]);
  private readonly _cargando = signal(false);
  private readonly _error = signal<string | null>(null);
  private cargado = false;

  readonly elementos = this._elementos.asReadonly();
  readonly cargando = this._cargando.asReadonly();
  readonly error = this._error.asReadonly();
  readonly porId = computed(() => new Map(this._elementos().map((e) => [e.id, e])));

  constructor(private readonly repository: CatalogoRepository<T>) {}

  async cargar(): Promise<void> {
    this._cargando.set(true);
    this._error.set(null);
    try {
      this._elementos.set(await firstValueFrom(this.repository.listar()));
      this.cargado = true;
    } catch (e) {
      this._error.set(aApiError(e).message);
    } finally {
      this._cargando.set(false);
    }
  }

  /** Carga la lista solo si todavía no se cargó. */
  async asegurarCargados(): Promise<void> {
    if (!this.cargado && !this._cargando()) await this.cargar();
  }

  async crear(datos: ElementoCatalogoDatos): Promise<T> {
    const creado = await firstValueFrom(this.repository.crear(datos));
    this._elementos.update((lista) => [...lista, creado].sort(compararPorDescripcion));
    return creado;
  }

  async actualizar(id: number, datos: ElementoCatalogoDatos): Promise<T> {
    const actualizado = await firstValueFrom(this.repository.actualizar(id, datos));
    this._elementos.update((lista) =>
      lista.map((e) => (e.id === id ? actualizado : e)).sort(compararPorDescripcion),
    );
    return actualizado;
  }

  async eliminar(id: number): Promise<void> {
    await firstValueFrom(this.repository.eliminar(id));
    this._elementos.update((lista) => lista.filter((e) => e.id !== id));
  }
}
