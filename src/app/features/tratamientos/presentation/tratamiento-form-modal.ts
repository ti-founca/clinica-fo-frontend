import { Injectable, inject } from '@angular/core';
import { FormularioModal } from '../../../shared/ui/formulario-modal';
import { TratamientosStore } from '../application/tratamientos.store';
import { Tratamiento } from '../domain/tratamiento';
import {
  TratamientoForm,
  TratamientoFormData,
} from './components/tratamiento-form/tratamiento-form';

/**
 * Abre el formulario de tratamientos en un modal. Recibe el store de la página que lo abre,
 * ya que cada página tiene su propia lista de tratamientos.
 */
@Injectable({ providedIn: 'root' })
export class TratamientoFormModal {
  private readonly modal = inject(FormularioModal);

  crear(
    store: TratamientosStore,
    opciones: Pick<TratamientoFormData, 'pacienteId' | 'pacienteFijo'> = {},
  ): Promise<Tratamiento | undefined> {
    return this.modal.abrir(TratamientoForm, 'Nuevo tratamiento', {
      ...opciones,
      guardar: (datos) => store.crear(datos),
    } satisfies TratamientoFormData);
  }

  editar(
    store: TratamientosStore,
    tratamiento: Tratamiento,
    opciones: Pick<TratamientoFormData, 'pacienteFijo'> = {},
  ): Promise<Tratamiento | undefined> {
    return this.modal.abrir(TratamientoForm, 'Editar tratamiento', {
      ...opciones,
      registro: tratamiento,
      guardar: (datos) => store.actualizar(tratamiento.id, datos),
    } satisfies TratamientoFormData);
  }
}
