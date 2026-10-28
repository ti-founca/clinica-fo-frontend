import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { aApiError } from '../../../../../core/http/api-error';
import { PacientesStore } from '../../../../pacientes/application/pacientes.store';
import { nombreCompleto } from '../../../../pacientes/domain/paciente';
import { TratamientosStore } from '../../../application/tratamientos.store';
import { Tratamiento } from '../../../domain/tratamiento';
import { TratamientosTabla } from '../../components/tratamientos-tabla/tratamientos-tabla';
import { TratamientoFormModal } from '../../tratamiento-form-modal';

@Component({
  selector: 'app-tratamientos-lista',
  imports: [
    FormsModule,
    NzAlertModule,
    NzButtonModule,
    NzIconModule,
    NzPageHeaderModule,
    NzSelectModule,
    TratamientosTabla,
  ],
  providers: [TratamientosStore],
  templateUrl: './tratamientos-lista.html',
})
export class TratamientosLista {
  protected readonly store = inject(TratamientosStore);
  protected readonly pacientes = inject(PacientesStore);
  private readonly formModal = inject(TratamientoFormModal);
  private readonly message = inject(NzMessageService);
  protected readonly nombreCompleto = nombreCompleto;

  constructor() {
    this.store.cargar();
    // Catálogo para mostrar el nombre del paciente y filtrar.
    this.pacientes.asegurarCargados();
  }

  protected async nuevo(): Promise<void> {
    const pacienteId = this.store.pacienteId() ?? undefined;
    if (await this.formModal.crear(this.store, { pacienteId })) {
      this.message.success('Tratamiento registrado');
    }
  }

  protected async editar(tratamiento: Tratamiento): Promise<void> {
    if (await this.formModal.editar(this.store, tratamiento)) {
      this.message.success('Tratamiento actualizado');
    }
  }

  protected async eliminar(tratamiento: Tratamiento): Promise<void> {
    try {
      await this.store.eliminar(tratamiento.id);
      this.message.success('Tratamiento eliminado');
    } catch (e) {
      this.message.error(aApiError(e).message);
    }
  }
}
