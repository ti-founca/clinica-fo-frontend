import { FormGroup } from '@angular/forms';

/** Marca como sucios todos los controles para que se muestren sus errores. */
export function mostrarErrores(form: FormGroup): void {
  Object.values(form.controls).forEach((control) => {
    control.markAsDirty();
    control.updateValueAndValidity({ onlySelf: true });
  });
}

/** Asigna a cada control los errores de validación devueltos por el backend. */
export function aplicarErroresDelServidor(form: FormGroup, errores: Record<string, string>): void {
  Object.entries(errores).forEach(([campo, mensaje]) => {
    const control = form.get(campo);
    control?.setErrors({ ...control.errors, servidor: mensaje });
    control?.markAsDirty();
  });
}
