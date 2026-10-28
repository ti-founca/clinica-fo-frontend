import { Routes } from '@angular/router';

export const PRECONSULTAS_ROUTES: Routes = [
  {
    path: '',
    title: 'Preconsultas',
    loadComponent: () =>
      import('./presentation/pages/preconsultas-lista/preconsultas-lista').then(
        (m) => m.PreconsultasLista,
      ),
  },
];
