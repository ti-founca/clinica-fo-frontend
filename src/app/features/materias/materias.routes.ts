import { Routes } from '@angular/router';

export const MATERIAS_ROUTES: Routes = [
  {
    path: '',
    title: 'Materias',
    loadComponent: () =>
      import('./presentation/pages/materias-lista/materias-lista').then((m) => m.MateriasLista),
  },
];
