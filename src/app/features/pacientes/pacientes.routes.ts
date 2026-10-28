import { Routes } from '@angular/router';

export const PACIENTES_ROUTES: Routes = [
  {
    path: '',
    title: 'Pacientes',
    loadComponent: () =>
      import('./presentation/pages/pacientes-lista/pacientes-lista').then((m) => m.PacientesLista),
  },
  {
    path: ':id',
    title: 'Ficha del paciente',
    loadComponent: () =>
      import('./presentation/pages/paciente-detalle/paciente-detalle').then(
        (m) => m.PacienteDetalle,
      ),
  },
];
