import { Injectable, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { aApiError } from '../../../core/http/api-error';
import { Preconsulta, PreconsultaDatos, compararPreconsultas } from '../domain/preconsulta';
import { PreconsultaRepository } from '../domain/preconsulta.repository';

/**
 * Estado de una lista de preconsultas, opcionalmente filtrada por paciente. Se provee a nivel de
 * página (`providers: [PreconsultasStore]`) para que cada vista tenga su propia lista y filtro.
 */
@Injectable()
export class PreconsultasStore {
  private readonly repository = inject(PreconsultaRepository);

  private readonly _preconsultas = signal<Preconsulta[]>([]);
  private readonly _pacienteId = signal<number | null>(null);
  private readonly _cargando = signal(false);
  private readonly _error = signal<string | null>(null);
  /** Descarta respuestas de cargas anteriores si el filtro cambió entretanto. */
  private ultimaCarga = 0;

  readonly preconsultas = this._preconsultas.asReadonly();
  readonly pacienteId = this._pacienteId.asReadonly();
  readonly cargando = this._cargando.asReadonly();
  readonly error = this._error.asReadonly();

  /** Filtra por paciente (`null` = todas) y recarga la lista. */
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
      if (carga === this.ultimaCarga) this._preconsultas.set(lista);
    } catch (e) {
      if (carga === this.ultimaCarga) this._error.set(aApiError(e).message);
    } finally {
      if (carga === this.ultimaCarga) this._cargando.set(false);
    }
  }

  async crear(datos: PreconsultaDatos): Promise<Preconsulta> {
    const creada = await firstValueFrom(this.repository.crear(datos));
    this.reemplazar(creada.id, creada);
    return creada;
  }

  async actualizar(id: number, datos: PreconsultaDatos): Promise<Preconsulta> {
    const actualizada = await firstValueFrom(this.repository.actualizar(id, datos));
    this.reemplazar(id, actualizada);
    return actualizada;
  }

  async eliminar(id: number): Promise<void> {
    await firstValueFrom(this.repository.eliminar(id));
    this.reemplazar(id, null);
  }

  /** Actualiza la lista local respetando el filtro y el orden del backend. */
  private reemplazar(id: number, preconsulta: Preconsulta | null): void {
    const filtro = this._pacienteId();
    const visible = preconsulta && (filtro === null || preconsulta.pacienteId === filtro);
    this._preconsultas.update((lista) => {
      const resto = lista.filter((p) => p.id !== id);
      return visible ? [...resto, preconsulta].sort(compararPreconsultas) : resto;
    });
  }
}
