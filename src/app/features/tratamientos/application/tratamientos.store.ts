import { Injectable, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { aApiError } from '../../../core/http/api-error';
import { Tratamiento, TratamientoDatos, compararTratamientos } from '../domain/tratamiento';
import { TratamientoRepository } from '../domain/tratamiento.repository';

/**
 * Estado de una lista de tratamientos, opcionalmente filtrada por paciente. Se provee a nivel de
 * página (`providers: [TratamientosStore]`) para que cada vista tenga su propia lista y filtro.
 */
@Injectable()
export class TratamientosStore {
  private readonly repository = inject(TratamientoRepository);

  private readonly _tratamientos = signal<Tratamiento[]>([]);
  private readonly _pacienteId = signal<number | null>(null);
  private readonly _cargando = signal(false);
  private readonly _error = signal<string | null>(null);
  /** Descarta respuestas de cargas anteriores si el filtro cambió entretanto. */
  private ultimaCarga = 0;

  readonly tratamientos = this._tratamientos.asReadonly();
  readonly pacienteId = this._pacienteId.asReadonly();
  readonly cargando = this._cargando.asReadonly();
  readonly error = this._error.asReadonly();

  /** Filtra por paciente (`null` = todos) y recarga la lista. */
  filtrarPorPaciente(pacienteId: number | null): Promise<void> {
    this._pacienteId.set(pacienteId);
    return this.cargar();
  }

  async cargar(): Promise<void> {
    const carga = ++this.ultimaCarga;
    const pacienteId = this._pacienteId();
    this._cargando.set(true);
    this._error.set(null);
    try {
      const lista = await firstValueFrom(
        pacienteId === null
          ? this.repository.listar()
          : this.repository.listarPorPaciente(pacienteId),
      );
      if (carga === this.ultimaCarga) this._tratamientos.set(lista);
    } catch (e) {
      if (carga === this.ultimaCarga) this._error.set(aApiError(e).message);
    } finally {
      if (carga === this.ultimaCarga) this._cargando.set(false);
    }
  }

  async crear(datos: TratamientoDatos): Promise<Tratamiento> {
    const creado = await firstValueFrom(this.repository.crear(datos));
    this.reemplazar(creado.id, creado);
    return creado;
  }

  async actualizar(id: number, datos: TratamientoDatos): Promise<Tratamiento> {
    const actualizado = await firstValueFrom(this.repository.actualizar(id, datos));
    this.reemplazar(id, actualizado);
    return actualizado;
  }

  async eliminar(id: number): Promise<void> {
    await firstValueFrom(this.repository.eliminar(id));
    this.reemplazar(id, null);
  }

  /** Actualiza la lista local respetando el filtro y el orden del backend. */
  private reemplazar(id: number, tratamiento: Tratamiento | null): void {
    const filtro = this._pacienteId();
    const visible = tratamiento && (filtro === null || tratamiento.pacienteId === filtro);
    this._tratamientos.update((lista) => {
      const resto = lista.filter((t) => t.id !== id);
      return visible ? [...resto, tratamiento].sort(compararTratamientos) : resto;
    });
  }
}
