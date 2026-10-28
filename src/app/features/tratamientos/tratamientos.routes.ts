import { Routes } from '@angular/router';

export const TRATAMIENTOS_ROUTES: Routes = [
  {
    path: '',
    title: 'Tratamientos',
    loadComponent: () =>
      import('./presentation/pages/tratamientos-lista/tratamientos-lista').then(
        (m) => m.TratamientosLista,
      ),
  },
];
