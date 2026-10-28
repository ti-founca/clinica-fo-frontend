import { Component, inject } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NZ_MODAL_DATA, NzModalModule, NzModalRef } from 'ng-zorro-antd/modal';
import { ErrorTip } from '../../ui/error-tip';
import { EnvioFormulario, FormularioModalData } from '../../ui/formulario-modal';
import { noVacio } from '../../utils/validadores';
import { ElementoCatalogo, ElementoCatalogoDatos } from '../elemento-catalogo';

export interface CatalogoFormData extends FormularioModalData<
  ElementoCatalogo,
  ElementoCatalogoDatos
> {
  /** Texto de ayuda del campo, p. ej. `Clínica de Operatoria Dental I`. */
  ejemplo: string;
}

/** Longitud máxima de la descripción en el backend. */
export const MAX_DESCRIPCION = 150;

/** Formulario de alta/edición de un elemento de catálogo (solo la descripción). */
@Component({
  selector: 'app-catalogo-form',
  imports: [
    ReactiveFormsModule,
    NzAlertModule,
    NzButtonModule,
    NzFormModule,
    NzInputModule,
    NzModalModule,
    ErrorTip,
  ],
  template: `
    <app-error-tip #errores />

    <form nz-form nzLayout="vertical" [formGroup]="form" (ngSubmit)="guardar()">
      @if (envio.error(); as error) {
        <nz-alert nzType="error" nzShowIcon [nzMessage]="error" class="form-alert" />
      }

      <nz-form-item>
        <nz-form-label nzRequired nzFor="descripcion">Descripción</nz-form-label>
        <nz-form-control [nzErrorTip]="errores.plantilla()">
          <input
            nz-input
            id="descripcion"
            formControlName="descripcion"
            [maxlength]="maxDescripcion"
            [placeholder]="data.ejemplo"
          />
        </nz-form-control>
      </nz-form-item>

      <!-- Permite enviar con Enter -->
      <button type="submit" hidden></button>
    </form>

    <div *nzModalFooter>
      <button nz-button type="button" (click)="envio.cancelar()">Cancelar</button>
      <button
        nz-button
        nzType="primary"
        type="button"
        [nzLoading]="envio.guardando()"
        (click)="guardar()"
      >
        Guardar
      </button>
    </div>
  `,
})
export class CatalogoForm {
  protected readonly data = inject<CatalogoFormData>(NZ_MODAL_DATA);
  protected readonly maxDescripcion = MAX_DESCRIPCION;

  protected readonly form = inject(NonNullableFormBuilder).group({
    descripcion: ['', [Validators.required, Validators.maxLength(MAX_DESCRIPCION), noVacio]],
  });

  protected readonly envio = new EnvioFormulario(this.form, inject(NzModalRef), this.data.guardar);

  constructor() {
    if (this.data.registro) this.form.patchValue(this.data.registro);
  }

  protected guardar(): void {
    this.envio.enviar(() => ({ descripcion: this.form.getRawValue().descripcion.trim() }));
  }
}
