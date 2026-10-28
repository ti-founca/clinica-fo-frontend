import { AbstractControl, ValidationErrors } from '@angular/forms';

/** Equivalente a `@NotBlank`: rechaza textos formados solo por espacios. */
export function noVacio(control: AbstractControl<string>): ValidationErrors | null {
  const valor = control.value ?? '';
  return valor.length > 0 && valor.trim().length === 0 ? { whitespace: true } : null;
}
