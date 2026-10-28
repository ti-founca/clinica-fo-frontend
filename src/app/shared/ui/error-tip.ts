import { Component, TemplateRef, viewChild } from '@angular/core';
import { AbstractControl } from '@angular/forms';

/**
 * Plantilla de mensajes de error para `nzErrorTip`. Uso:
 * `<app-error-tip #errores />` y `[nzErrorTip]="errores.plantilla()"`.
 */
@Component({
  selector: 'app-error-tip',
  template: `
    <ng-template #plantilla let-control>
      @let e = errores(control);
      @if (e['servidor']) {
        {{ e['servidor'] }}
      } @else if (e['required']) {
        Campo obligatorio
      } @else if (e['maxlength']) {
        Máximo {{ e['maxlength'].requiredLength }} caracteres
      } @else if (e['min']) {
        El valor mínimo es {{ e['min'].min }}
      } @else if (e['max']) {
        El valor máximo es {{ e['max'].max }}
      } @else if (e['whitespace']) {
        No puede estar vacío
      }
    </ng-template>
  `,
})
export class ErrorTip {
  readonly plantilla = viewChild.required<TemplateRef<{ $implicit: AbstractControl }>>('plantilla');

  protected errores(control: AbstractControl): Record<string, any> {
    return control.errors ?? {};
  }
}
