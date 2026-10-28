import { Component, inject } from '@angular/core';
import {
  CatalogoLista,
  TextosCatalogo,
} from '../../../../../shared/catalogo/catalogo-lista/catalogo-lista';
import { ProcedimientosStore } from '../../../application/procedimientos.store';

@Component({
  selector: 'app-procedimientos-lista',
  imports: [CatalogoLista],
  template: '<app-catalogo-lista [store]="store" [textos]="textos" />',
})
export class ProcedimientosLista {
  protected readonly store = inject(ProcedimientosStore);
  protected readonly textos: TextosCatalogo = {
    titulo: 'Procedimientos',
    subtitulo: 'Tratamientos que pueden recibir los pacientes',
    nuevo: 'Nuevo procedimiento',
    editar: 'Editar procedimiento',
    registrado: 'Procedimiento registrado',
    actualizado: 'Procedimiento actualizado',
    eliminado: 'Procedimiento eliminado',
    confirmarEliminar: '¿Eliminar este procedimiento?',
    enUso: 'No se puede eliminar: el procedimiento está asignado a tratamientos',
    ejemplo: 'Extracción dentaria',
  };

  constructor() {
    this.store.cargar();
  }
}
