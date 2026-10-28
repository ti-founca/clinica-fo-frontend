import { Routes } from '@angular/router';

export const PROCEDIMIENTOS_ROUTES: Routes = [
  {
    path: '',
    title: 'Procedimientos',
    loadComponent: () =>
      import('./presentation/pages/procedimientos-lista/procedimientos-lista').then(
        (m) => m.ProcedimientosLista,
      ),
  },
];
