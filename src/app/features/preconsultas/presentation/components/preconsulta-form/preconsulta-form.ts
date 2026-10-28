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
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NZ_MODAL_DATA, NzModalModule, NzModalRef } from 'ng-zorro-antd/modal';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { EnvioFormulario, FormularioModalData } from '../../../../../shared/ui/formulario-modal';
import { ErrorTip } from '../../../../../shared/ui/error-tip';
import { aFechaHoraLocal, desdeFechaHoraLocal } from '../../../../../shared/utils/fecha-hora';
import { PacientesStore } from '../../../../pacientes/application/pacientes.store';
import { nombreCompleto } from '../../../../pacientes/domain/paciente';
import { LIMITES, Preconsulta, PreconsultaDatos } from '../../../domain/preconsulta';

export interface PreconsultaFormData extends FormularioModalData<Preconsulta, PreconsultaDatos> {
  /** Paciente preseleccionado al crear desde la ficha del paciente. */
  pacienteId?: number;
  /** Impide cambiar el paciente (se usa desde la ficha del paciente). */
  pacienteFijo?: boolean;
}

const rango = ({ min, max }: { min: number; max: number }) => [
  null as number | null,
  [Validators.required, Validators.min(min), Validators.max(max)],
];

/** Regla del backend: la presión sistólica debe ser mayor que la diastólica. */
function sistolicaMayorQueDiastolica(grupo: AbstractControl): ValidationErrors | null {
  const { presionSistolica: s, presionDiastolica: d } = grupo.value;
  return s != null && d != null && s <= d ? { presion: true } : null;
}

@Component({
  selector: 'app-preconsulta-form',
  imports: [
    ReactiveFormsModule,
    NzAlertModule,
    NzButtonModule,
    NzDatePickerModule,
    NzFormModule,
    NzGridModule,
    NzInputNumberModule,
    NzModalModule,
    NzSelectModule,
    ErrorTip,
  ],
  templateUrl: './preconsulta-form.html',
})
export class PreconsultaForm {
  private readonly data = inject<PreconsultaFormData>(NZ_MODAL_DATA);
  protected readonly pacientes = inject(PacientesStore);
  protected readonly limites = LIMITES;
  protected readonly nombreCompleto = nombreCompleto;
  protected readonly esEdicion = !!this.data.registro;

  protected readonly form = inject(NonNullableFormBuilder).group(
    {
      pacienteId: [null as number | null, Validators.required],
      fechaHora: [null as Date | null],
      presionSistolica: rango(LIMITES.presionSistolica),
      presionDiastolica: rango(LIMITES.presionDiastolica),
      frecuenciaCardiaca: rango(LIMITES.frecuenciaCardiaca),
      temperatura: rango(LIMITES.temperatura),
    },
    { validators: sistolicaMayorQueDiastolica },
  );

  protected readonly envio = new EnvioFormulario(this.form, inject(NzModalRef), this.data.guardar);

  constructor() {
    this.pacientes.asegurarCargados();

    const registro = this.data.registro;
    if (registro) {
      this.form.patchValue({ ...registro, fechaHora: desdeFechaHoraLocal(registro.fechaHora) });
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
        // Sin fecha: el backend usa "ahora" al crear y conserva la registrada al editar.
        ...(v.fechaHora ? { fechaHora: aFechaHoraLocal(v.fechaHora) } : {}),
        presionSistolica: v.presionSistolica!,
        presionDiastolica: v.presionDiastolica!,
        frecuenciaCardiaca: v.frecuenciaCardiaca!,
        temperatura: v.temperatura!,
      };
    });
  }
}
