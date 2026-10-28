import { DatePipe } from '@angular/common';
import { Component, inject, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzTooltipModule } from 'ng-zorro-antd/tooltip';
import { MateriasStore } from '../../../../materias/application/materias.store';
import { PacientesStore } from '../../../../pacientes/application/pacientes.store';
import { nombreCompleto } from '../../../../pacientes/domain/paciente';
import { ProcedimientosStore } from '../../../../procedimientos/application/procedimientos.store';
import { Tratamiento, enCurso } from '../../../domain/tratamiento';

/** Tabla de tratamientos reutilizada en el listado general y en la ficha del paciente. */
@Component({
  selector: 'app-tratamientos-tabla',
  imports: [
    DatePipe,
    RouterLink,
    NzDividerModule,
    NzIconModule,
    NzPopconfirmModule,
    NzTableModule,
    NzTagModule,
    NzTooltipModule,
  ],
  templateUrl: './tratamientos-tabla.html',
})
export class TratamientosTabla {
  readonly tratamientos = input.required<Tratamiento[]>();
  readonly cargando = input(false);
  /** Muestra la columna del paciente (se oculta en la ficha del paciente). */
  readonly mostrarPaciente = input(true);

  readonly editar = output<Tratamiento>();
  readonly eliminar = output<Tratamiento>();

  protected readonly pacientes = inject(PacientesStore);
  protected readonly procedimientos = inject(ProcedimientosStore);
  protected readonly materias = inject(MateriasStore);
  protected readonly nombreCompleto = nombreCompleto;
  protected readonly enCurso = enCurso;

  constructor() {
    // Catálogos para mostrar las descripciones en lugar de los ids.
    this.procedimientos.asegurarCargados();
    this.materias.asegurarCargados();
  }
}
