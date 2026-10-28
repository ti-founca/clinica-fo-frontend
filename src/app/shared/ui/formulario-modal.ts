import { Injectable, Type, inject, signal } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { ApiError, aApiError } from '../../core/http/api-error';
import { aplicarErroresDelServidor, mostrarErrores } from '../utils/formulario';

/**
 * Datos que recibe un formulario abierto en un modal. El formulario no sabe cómo se guarda:
 * recibe la acción `guardar` de quien lo abre (normalmente un store).
 */
export interface FormularioModalData<T, D> {
  /** Registro a editar; si no se indica, el formulario es de alta. */
  registro?: T;
  guardar: (datos: D) => Promise<T>;
}

@Injectable({ providedIn: 'root' })
export class FormularioModal {
  private readonly modal = inject(NzModalService);

  /** Abre `componente` en un modal; resuelve con el registro guardado o `undefined` si se canceló. */
  abrir<T, D, C>(
    componente: Type<C>,
    titulo: string,
    data: FormularioModalData<T, D> & Record<string, unknown>,
    ancho = 560,
  ): Promise<T | undefined> {
    const ref = this.modal.create<C, typeof data, T>({
      nzTitle: titulo,
      nzContent: componente,
      nzData: data,
      nzWidth: ancho,
      nzMaskClosable: false,
      nzFooter: null, // el formulario define su propio pie con *nzModalFooter
    });
    return new Promise((resolve) => ref.afterClose.subscribe((r) => resolve(r ?? undefined)));
  }
}

/**
 * Lógica común de envío para los formularios en modal: valida, invoca `guardar`, muestra los
 * errores del backend y cierra el modal devolviendo el registro guardado.
 */
export class EnvioFormulario<T, D> {
  readonly guardando = signal(false);
  readonly error = signal<string | null>(null);

  constructor(
    private readonly form: FormGroup,
    private readonly modalRef: NzModalRef<unknown, T>,
    private readonly guardar: (datos: D) => Promise<T>,
  ) {}

  async enviar(datos: () => D): Promise<void> {
    if (this.form.invalid) {
      mostrarErrores(this.form);
      return;
    }
    this.guardando.set(true);
    this.error.set(null);
    try {
      this.modalRef.close(await this.guardar(datos()));
    } catch (e) {
      const error: ApiError = aApiError(e);
      aplicarErroresDelServidor(this.form, error.errores);
      this.error.set(error.message);
    } finally {
      this.guardando.set(false);
    }
  }

  cancelar(): void {
    this.modalRef.close();
  }
}
