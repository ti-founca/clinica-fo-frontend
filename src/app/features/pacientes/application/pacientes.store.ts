import { Injectable, computed, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { aApiError } from '../../../core/http/api-error';
import { Paciente, PacienteDatos, compararPacientes } from '../domain/paciente';
import { PacienteRepository } from '../domain/paciente.repository';

/**
 * Estado de los pacientes basado en signals. Es global porque otras funcionalidades
 * (preconsultas) lo usan como catálogo para seleccionar y mostrar pacientes.
 */
@Injectable({ providedIn: 'root' })
export class PacientesStore {
  private readonly repository = inject(PacienteRepository);

  private readonly _pacientes = signal<Paciente[]>([]);
  private readonly _cargando = signal(false);
  private readonly _error = signal<string | null>(null);
  private cargado = false;

  readonly pacientes = this._pacientes.asReadonly();
  readonly cargando = this._cargando.asReadonly();
  readonly error = this._error.asReadonly();
  readonly porId = computed(() => new Map(this._pacientes().map((p) => [p.id, p])));

  async cargar(): Promise<void> {
    this._cargando.set(true);
    this._error.set(null);
    try {
      this._pacientes.set(await firstValueFrom(this.repository.listar()));
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

  obtener(id: number): Promise<Paciente> {
    return firstValueFrom(this.repository.obtener(id));
  }

  async crear(datos: PacienteDatos): Promise<Paciente> {
    const creado = await firstValueFrom(this.repository.crear(datos));
    this._pacientes.update((lista) => [...lista, creado].sort(compararPacientes));
    return creado;
  }

  async actualizar(id: number, datos: PacienteDatos): Promise<Paciente> {
    const actualizado = await firstValueFrom(this.repository.actualizar(id, datos));
    this._pacientes.update((lista) =>
      lista.map((p) => (p.id === id ? actualizado : p)).sort(compararPacientes),
    );
    return actualizado;
  }

  async eliminar(id: number): Promise<void> {
    await firstValueFrom(this.repository.eliminar(id));
    this._pacientes.update((lista) => lista.filter((p) => p.id !== id));
  }
}
