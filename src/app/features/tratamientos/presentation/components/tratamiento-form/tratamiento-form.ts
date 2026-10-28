import { Component, inject } from '@angular/core';
import {
  AbstractControl,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NZ_MODAL_DATA, NzModalModule, NzModalRef } from 'ng-zorro-antd/modal';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { EnvioFormulario, FormularioModalData } from '../../../../../shared/ui/formulario-modal';
import { ErrorTip } from '../../../../../shared/ui/error-tip';
import { aFechaLocal, desdeFechaLocal } from '../../../../../shared/utils/fecha-hora';
import { MateriasStore } from '../../../../materias/application/materias.store';
import { PacientesStore } from '../../../../pacientes/application/pacientes.store';
import { nombreCompleto } from '../../../../pacientes/domain/paciente';
import { ProcedimientosStore } from '../../../../procedimientos/application/procedimientos.store';
import { Tratamiento, TratamientoDatos } from '../../../domain/tratamiento';

export interface TratamientoFormData extends FormularioModalData<Tratamiento, TratamientoDatos> {
  /** Paciente preseleccionado al crear desde la ficha del paciente. */
  pacienteId?: number;
  /** Impide cambiar el paciente (se usa desde la ficha del paciente). */
  pacienteFijo?: boolean;
}

/** Compara solo el día (los date pickers pueden incluir la hora actual). */
const soloDia = (fecha: Date) => new Date(fecha.getFullYear(), fecha.getMonth(), fecha.getDate());

/** Regla del backend: la fecha de finalización no puede ser anterior a la de inicio. */
export function finNoAnteriorAInicio(grupo: AbstractControl): ValidationErrors | null {
  const { fechaInicio, fechaFin } = grupo.value as { fechaInicio?: Date; fechaFin?: Date };
  return fechaInicio && fechaFin && soloDia(fechaFin) < soloDia(fechaInicio)
    ? { fechas: true }
    : null;
}

@Component({
  selector: 'app-tratamiento-form',
  imports: [
    ReactiveFormsModule,
    NzAlertModule,
    NzButtonModule,
    NzDatePickerModule,
    NzFormModule,
    NzGridModule,
    NzModalModule,
    NzSelectModule,
    ErrorTip,
  ],
  templateUrl: './tratamiento-form.html',
})
export class TratamientoForm {
  private readonly data = inject<TratamientoFormData>(NZ_MODAL_DATA);
  protected readonly pacientes = inject(PacientesStore);
  protected readonly procedimientos = inject(ProcedimientosStore);
  protected readonly materias = inject(MateriasStore);
  protected readonly nombreCompleto = nombreCompleto;

  protected readonly form = inject(NonNullableFormBuilder).group(
    {
      pacienteId: [null as number | null, Validators.required],
      procedimientoId: [null as number | null, Validators.required],
      materiaId: [null as number | null, Validators.required],
      fechaInicio: [new Date() as Date | null, Validators.required],
      fechaFin: [null as Date | null],
    },
    { validators: finNoAnteriorAInicio },
  );

  protected readonly envio = new EnvioFormulario(this.form, inject(NzModalRef), this.data.guardar);

  /** Deshabilita en el calendario de fin los días anteriores al inicio. */
  protected readonly antesDelInicio = (fecha: Date): boolean => {
    const inicio = this.form.controls.fechaInicio.value;
    return !!inicio && soloDia(fecha) < soloDia(inicio);
  };

  constructor() {
    this.pacientes.asegurarCargados();
    this.procedimientos.asegurarCargados();
    this.materias.asegurarCargados();

    const registro = this.data.registro;
    if (registro) {
      this.form.patchValue({
        ...registro,
        fechaInicio: desdeFechaLocal(registro.fechaInicio),
        fechaFin: registro.fechaFin ? desdeFechaLocal(registro.fechaFin) : null,
      });
    } else if (this.data.pacienteId != null) {
      this.form.patchValue({ pacienteId: this.data.pacienteId });
    }
    if (this.data.pacienteFijo) this.form.controls.pacienteId.disable();
  }

  protected guardar(): void {
    this.envio.enviar(() => {
      const v = this.form.getRawValue();
      return {
        pacienteId: v.pacienteId!,
        procedimientoId: v.procedimientoId!,
        materiaId: v.materiaId!,
        fechaInicio: aFechaLocal(v.fechaInicio!),
        // Sin fecha de finalización el tratamiento queda en curso.
        fechaFin: v.fechaFin ? aFechaLocal(v.fechaFin) : null,
      };
    });
  }
}
