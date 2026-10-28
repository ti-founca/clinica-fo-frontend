import { Injectable, inject } from '@angular/core';
import { FormularioModal } from '../../../shared/ui/formulario-modal';
import { PacientesStore } from '../application/pacientes.store';
import { Paciente } from '../domain/paciente';
import { PacienteForm, PacienteFormData } from './components/paciente-form/paciente-form';

/** Abre el formulario de pacientes en un modal y guarda a través del store. */
@Injectable({ providedIn: 'root' })
export class PacienteFormModal {
  private readonly modal = inject(FormularioModal);
  private readonly store = inject(PacientesStore);

  crear(): Promise<Paciente | undefined> {
    return this.modal.abrir(PacienteForm, 'Nuevo paciente', {
      guardar: (datos) => this.store.crear(datos),
    } satisfies PacienteFormData);
  }

  editar(paciente: Paciente): Promise<Paciente | undefined> {
    return this.modal.abrir(PacienteForm, 'Editar paciente', {
      registro: paciente,
      guardar: (datos) => this.store.actualizar(paciente.id, datos),
    } satisfies PacienteFormData);
  }
}
