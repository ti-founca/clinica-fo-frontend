import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzTooltipModule } from 'ng-zorro-antd/tooltip';
import { aApiError } from '../../../../../core/http/api-error';
import { PacientesStore } from '../../../application/pacientes.store';
import { Paciente } from '../../../domain/paciente';
import { PacienteFormModal } from '../../paciente-form-modal';

@Component({
  selector: 'app-pacientes-lista',
  imports: [
    RouterLink,
    NzAlertModule,
    NzButtonModule,
    NzDividerModule,
    NzIconModule,
    NzInputModule,
    NzPageHeaderModule,
    NzPopconfirmModule,
    NzTableModule,
    NzTooltipModule,
  ],
  templateUrl: './pacientes-lista.html',
})
export class PacientesLista {
  protected readonly store = inject(PacientesStore);
  private readonly formModal = inject(PacienteFormModal);
  private readonly message = inject(NzMessageService);

  protected readonly busqueda = signal('');
  protected readonly filtrados = computed(() => {
    const termino = this.busqueda().trim().toLowerCase();
    if (!termino) return this.store.pacientes();
    return this.store
      .pacientes()
      .filter((p) =>
        [p.nombres, p.apellidos, p.numeroDocumento, p.ciudad].some((v) =>
          v.toLowerCase().includes(termino),
        ),
      );
  });

  constructor() {
    this.store.cargar();
  }

  protected async nuevo(): Promise<void> {
    if (await this.formModal.crear()) this.message.success('Paciente registrado');
  }

  protected async editar(paciente: Paciente): Promise<void> {
    if (await this.formModal.editar(paciente)) this.message.success('Paciente actualizado');
  }

  protected async eliminar(paciente: Paciente): Promise<void> {
    try {
      await this.store.eliminar(paciente.id);
      this.message.success('Paciente eliminado');
    } catch (e) {
      const error = aApiError(e);
      this.message.error(
        // El backend responde 409 cuando el paciente tiene preconsultas o tratamientos registrados.
        error.status === 409
          ? 'No se puede eliminar: el paciente tiene preconsultas o tratamientos registrados'
          : error.message,
      );
    }
  }
}
