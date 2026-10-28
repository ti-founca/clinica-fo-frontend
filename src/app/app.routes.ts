import { Routes } from '@angular/router';
import { Shell } from './core/layout/shell/shell';

export const routes: Routes = [
  {
    path: '',
    component: Shell,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'pacientes' },
      {
        path: 'pacientes',
        loadChildren: () =>
          import('./features/pacientes/pacientes.routes').then((m) => m.PACIENTES_ROUTES),
      },
      {
        path: 'preconsultas',
        loadChildren: () =>
          import('./features/preconsultas/preconsultas.routes').then((m) => m.PRECONSULTAS_ROUTES),
      },
      {
        path: 'tratamientos',
        loadChildren: () =>
          import('./features/tratamientos/tratamientos.routes').then((m) => m.TRATAMIENTOS_ROUTES),
      },
      {
        path: 'procedimientos',
        loadChildren: () =>
          import('./features/procedimientos/procedimientos.routes').then(
            (m) => m.PROCEDIMIENTOS_ROUTES,
          ),
      },
      {
        path: 'materias',
        loadChildren: () =>
          import('./features/materias/materias.routes').then((m) => m.MATERIAS_ROUTES),
      },
      { path: '**', redirectTo: 'pacientes' },
    ],
  },
];
