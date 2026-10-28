import { Component, inject } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NZ_MODAL_DATA, NzModalModule, NzModalRef } from 'ng-zorro-antd/modal';
import { EnvioFormulario, FormularioModalData } from '../../../../../shared/ui/formulario-modal';
import { ErrorTip } from '../../../../../shared/ui/error-tip';
import { noVacio } from '../../../../../shared/utils/validadores';
import { Paciente, PacienteDatos } from '../../../domain/paciente';

export type PacienteFormData = FormularioModalData<Paciente, PacienteDatos>;

const texto = (max: number) => ['', [Validators.required, Validators.maxLength(max), noVacio]];

@Component({
  selector: 'app-paciente-form',
  imports: [
    ReactiveFormsModule,
    NzAlertModule,
    NzButtonModule,
    NzFormModule,
    NzGridModule,
    NzInputModule,
    NzModalModule,
    ErrorTip,
  ],
  templateUrl: './paciente-form.html',
})
export class PacienteForm {
  private readonly data = inject<PacienteFormData>(NZ_MODAL_DATA);

  protected readonly form = inject(NonNullableFormBuilder).group({
    nombres: texto(100),
    apellidos: texto(100),
    numeroDocumento: texto(20),
    direccion: texto(200),
    barrio: texto(100),
    ciudad: texto(100),
  });

  protected readonly envio = new EnvioFormulario(this.form, inject(NzModalRef), this.data.guardar);

  constructor() {
    if (this.data.registro) this.form.patchValue(this.data.registro);
  }

  protected guardar(): void {
    this.envio.enviar(() => {
      const v = this.form.getRawValue();
      return Object.fromEntries(
        Object.entries(v).map(([k, valor]) => [k, valor.trim()]),
      ) as PacienteDatos;
    });
  }
}
