import { Component, computed, effect, inject, input, signal, untracked } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzResultModule } from 'ng-zorro-antd/result';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';
import { aApiError } from '../../../../../core/http/api-error';
import { PreconsultasStore } from '../../../../preconsultas/application/preconsultas.store';
import { Preconsulta } from '../../../../preconsultas/domain/preconsulta';
import { PreconsultasTabla } from '../../../../preconsultas/presentation/components/preconsultas-tabla/preconsultas-tabla';
import { PreconsultaFormModal } from '../../../../preconsultas/presentation/preconsulta-form-modal';
import { TratamientosStore } from '../../../../tratamientos/application/tratamientos.store';
import { Tratamiento } from '../../../../tratamientos/domain/tratamiento';
import { TratamientosTabla } from '../../../../tratamientos/presentation/components/tratamientos-tabla/tratamientos-tabla';
import { TratamientoFormModal } from '../../../../tratamientos/presentation/tratamiento-form-modal';
import { PacientesStore } from '../../../application/pacientes.store';
import { Paciente, nombreCompleto } from '../../../domain/paciente';
import { PacienteFormModal } from '../../paciente-form-modal';

/** Ficha del paciente con sus preconsultas y tratamientos (relaciones 1:N). */
@Component({
  selector: 'app-paciente-detalle',
  imports: [
    RouterLink,
    NzAlertModule,
    NzButtonModule,
    NzCardModule,
    NzDescriptionsModule,
    NzIconModule,
    NzPageHeaderModule,
    NzResultModule,
    NzSkeletonModule,
    PreconsultasTabla,
    TratamientosTabla,
  ],
  providers: [PreconsultasStore, TratamientosStore],
  templateUrl: './paciente-detalle.html',
})
export class PacienteDetalle {
  /** Parámetro `:id` de la ruta (enlazado con `withComponentInputBinding`). */
  readonly id = input.required<string>();

  private readonly router = inject(Router);
  private readonly pacientesStore = inject(PacientesStore);
  private readonly pacienteFormModal = inject(PacienteFormModal);
  private readonly preconsultaFormModal = inject(PreconsultaFormModal);
  private readonly message = inject(NzMessageService);
  private readonly tratamientoFormModal = inject(TratamientoFormModal);
  protected readonly preconsultas = inject(PreconsultasStore);
  protected readonly tratamientos = inject(TratamientosStore);

  protected readonly paciente = signal<Paciente | null>(null);
  protected readonly cargando = signal(true);
  protected readonly error = signal<string | null>(null);
  protected readonly titulo = computed(() => {
    const p = this.paciente();
    return p ? nombreCompleto(p) : 'Paciente';
  });

  constructor() {
    effect(() => {
      const id = Number(this.id());
      untracked(() => this.cargar(id));
    });
  }

  private async cargar(id: number): Promise<void> {
    this.cargando.set(true);
    this.error.set(null);
    try {
      this.paciente.set(await this.pacientesStore.obtener(id));
      await Promise.all([
        this.preconsultas.filtrarPorPaciente(id),
        this.tratamientos.filtrarPorPaciente(id),
      ]);
    } catch (e) {
      this.paciente.set(null);
      this.error.set(aApiError(e).message);
    } finally {
      this.cargando.set(false);
    }
  }

  protected volver(): void {
    this.router.navigate(['/pacientes']);
  }

  protected async editarPaciente(paciente: Paciente): Promise<void> {
    const actualizado = await this.pacienteFormModal.editar(paciente);
    if (actualizado) {
      this.paciente.set(actualizado);
      this.message.success('Paciente actualizado');
    }
  }

  protected async nuevaPreconsulta(paciente: Paciente): Promise<void> {
    const creada = await this.preconsultaFormModal.crear(this.preconsultas, {
      pacienteId: paciente.id,
      pacienteFijo: true,
    });
    if (creada) this.message.success('Preconsulta registrada');
  }

  protected async editarPreconsulta(preconsulta: Preconsulta): Promise<void> {
    const actualizada = await this.preconsultaFormModal.editar(this.preconsultas, preconsulta, {
      pacienteFijo: true,
    });
    if (actualizada) this.message.success('Preconsulta actualizada');
  }

  protected async eliminarPreconsulta(preconsulta: Preconsulta): Promise<void> {
    try {
      await this.preconsultas.eliminar(preconsulta.id);
      this.message.success('Preconsulta eliminada');
    } catch (e) {
      this.message.error(aApiError(e).message);
    }
  }

  protected async nuevoTratamiento(paciente: Paciente): Promise<void> {
    const creado = await this.tratamientoFormModal.crear(this.tratamientos, {
      pacienteId: paciente.id,
      pacienteFijo: true,
    });
    if (creado) this.message.success('Tratamiento registrado');
  }

  protected async editarTratamiento(tratamiento: Tratamiento): Promise<void> {
    const actualizado = await this.tratamientoFormModal.editar(this.tratamientos, tratamiento, {
      pacienteFijo: true,
    });
    if (actualizado) this.message.success('Tratamiento actualizado');
  }

  protected async eliminarTratamiento(tratamiento: Tratamiento): Promise<void> {
    try {
      await this.tratamientos.eliminar(tratamiento.id);
      this.message.success('Tratamiento eliminado');
    } catch (e) {
      this.message.error(aApiError(e).message);
    }
  }
}
