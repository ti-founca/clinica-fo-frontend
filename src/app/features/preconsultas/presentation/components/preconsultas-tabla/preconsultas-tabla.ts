import { DatePipe, DecimalPipe } from '@angular/common';
import { Component, inject, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzTooltipModule } from 'ng-zorro-antd/tooltip';
import { PacientesStore } from '../../../../pacientes/application/pacientes.store';
import { nombreCompleto } from '../../../../pacientes/domain/paciente';
import { Preconsulta } from '../../../domain/preconsulta';

/** Tabla de preconsultas reutilizada en el listado general y en la ficha del paciente. */
@Component({
  selector: 'app-preconsultas-tabla',
  imports: [
    DatePipe,
    DecimalPipe,
    RouterLink,
    NzDividerModule,
    NzIconModule,
    NzPopconfirmModule,
    NzTableModule,
    NzTooltipModule,
  ],
  templateUrl: './preconsultas-tabla.html',
})
export class PreconsultasTabla {
  readonly preconsultas = input.required<Preconsulta[]>();
  readonly cargando = input(false);
  /** Muestra la columna del paciente (se oculta en la ficha del paciente). */
  readonly mostrarPaciente = input(true);

  readonly editar = output<Preconsulta>();
  readonly eliminar = output<Preconsulta>();

  protected readonly pacientes = inject(PacientesStore);
  protected readonly nombreCompleto = nombreCompleto;
}
