import { Injectable, inject } from '@angular/core';
import { FormularioModal } from '../../../shared/ui/formulario-modal';
import { PreconsultasStore } from '../application/preconsultas.store';
import { Preconsulta } from '../domain/preconsulta';
import {
  PreconsultaForm,
  PreconsultaFormData,
} from './components/preconsulta-form/preconsulta-form';

/**
 * Abre el formulario de preconsultas en un modal. Recibe el store de la página que lo abre,
 * ya que cada página tiene su propia lista de preconsultas.
 */
@Injectable({ providedIn: 'root' })
export class PreconsultaFormModal {
  private readonly modal = inject(FormularioModal);

  crear(
    store: PreconsultasStore,
    opciones: Pick<PreconsultaFormData, 'pacienteId' | 'pacienteFijo'> = {},
  ): Promise<Preconsulta | undefined> {
    return this.modal.abrir(PreconsultaForm, 'Nueva preconsulta', {
      ...opciones,
      guardar: (datos) => store.crear(datos),
    } satisfies PreconsultaFormData);
  }

  editar(
    store: PreconsultasStore,
    preconsulta: Preconsulta,
    opciones: Pick<PreconsultaFormData, 'pacienteFijo'> = {},
  ): Promise<Preconsulta | undefined> {
    return this.modal.abrir(PreconsultaForm, 'Editar preconsulta', {
      ...opciones,
      registro: preconsulta,
      guardar: (datos) => store.actualizar(preconsulta.id, datos),
    } satisfies PreconsultaFormData);
  }
}
