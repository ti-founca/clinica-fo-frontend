import { Component, inject } from '@angular/core';
import {
  CatalogoLista,
  TextosCatalogo,
} from '../../../../../shared/catalogo/catalogo-lista/catalogo-lista';
import { MateriasStore } from '../../../application/materias.store';

@Component({
  selector: 'app-materias-lista',
  imports: [CatalogoLista],
  template: '<app-catalogo-lista [store]="store" [textos]="textos" />',
})
export class MateriasLista {
  protected readonly store = inject(MateriasStore);
  protected readonly textos: TextosCatalogo = {
    titulo: 'Materias',
    subtitulo: 'Asignaturas de la carrera',
    nuevo: 'Nueva materia',
    editar: 'Editar materia',
    registrado: 'Materia registrada',
    actualizado: 'Materia actualizada',
    eliminado: 'Materia eliminada',
    confirmarEliminar: '¿Eliminar esta materia?',
    enUso: 'No se puede eliminar: la materia está asignada a tratamientos',
    ejemplo: 'Clínica de Operatoria Dental I',
  };

  constructor() {
    this.store.cargar();
  }
}
