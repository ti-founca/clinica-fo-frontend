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
import { PreconsultasStore } from '../../../application/preconsultas.store';
import { Preconsulta } from '../../../domain/preconsulta';
import { PreconsultasTabla } from '../../components/preconsultas-tabla/preconsultas-tabla';
import { PreconsultaFormModal } from '../../preconsulta-form-modal';

@Component({
  selector: 'app-preconsultas-lista',
  imports: [
    FormsModule,
    NzAlertModule,
    NzButtonModule,
    NzIconModule,
    NzPageHeaderModule,
    NzSelectModule,
    PreconsultasTabla,
  ],
  providers: [PreconsultasStore],
  templateUrl: './preconsultas-lista.html',
})
export class PreconsultasLista {
  protected readonly store = inject(PreconsultasStore);
  protected readonly pacientes = inject(PacientesStore);
  private readonly formModal = inject(PreconsultaFormModal);
  private readonly message = inject(NzMessageService);
  protected readonly nombreCompleto = nombreCompleto;

  constructor() {
    this.store.cargar();
    // Catálogo para mostrar el nombre del paciente y filtrar.
    this.pacientes.asegurarCargados();
  }

  protected async nueva(): Promise<void> {
    const pacienteId = this.store.pacienteId() ?? undefined;
    if (await this.formModal.crear(this.store, { pacienteId })) {
      this.message.success('Preconsulta registrada');
    }
  }

  protected async editar(preconsulta: Preconsulta): Promise<void> {
    if (await this.formModal.editar(this.store, preconsulta)) {
      this.message.success('Preconsulta actualizada');
    }
  }

  protected async eliminar(preconsulta: Preconsulta): Promise<void> {
    try {
      await this.store.eliminar(preconsulta.id);
      this.message.success('Preconsulta eliminada');
    } catch (e) {
      this.message.error(aApiError(e).message);
    }
  }
}
