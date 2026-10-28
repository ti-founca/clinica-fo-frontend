# Clínicas – Frontend

Frontend en Angular 21 (sin Zone.js, basado en signals) + [NG-ZORRO](https://ng.ant.design) para la
API de `ClinicasClaudeBackend`: CRUD de pacientes, de sus preconsultas y tratamientos (relaciones 1:N)
y de los catálogos de procedimientos y materias.

## Ejecutar

```bash
npm install
npm start          # ng serve → http://localhost:4200 (usa la API de desarrollo)
npm run build      # build de producción en dist/clinicas-frontend
npm test           # tests unitarios (Vitest)
```

## Configuración de la API

| Configuración | Archivo                                        | `apiUrl`                  |
|---------------|------------------------------------------------|---------------------------|
| Desarrollo    | `src/environments/environment.development.ts` | `http://localhost:8080`   |
| Producción    | `src/environments/environment.ts`             | reemplazar por la real    |

`ng serve` usa la de desarrollo y `ng build` la de producción (`fileReplacements` en `angular.json`).
La URL se inyecta en los repositorios mediante el token `API_URL` (`core/config/api-url.ts`).

## Arquitectura

Clean Architecture ligera organizada en *vertical slices*, espejo del backend:

```
src/app
├── core/                 transversal a toda la app
│   ├── config/           token API_URL
│   ├── http/             ApiError (ProblemDetail RFC 9457) + interceptor de errores
│   └── layout/shell/     plantilla "sidemenu" de NG-ZORRO
├── shared/               UI y utilidades reutilizables (formularios en modal, fechas, validadores)
│   └── catalogo/         repositorio, store, formulario y página CRUD genéricos de catálogos
└── features/
    ├── pacientes/
    │   ├── domain/           modelo + puerto PacienteRepository (clase abstracta)
    │   ├── infrastructure/   PacienteHttpRepository (adaptador HTTP)
    │   ├── application/      PacientesStore (estado con signals + casos de uso)
    │   ├── presentation/     páginas, formulario en modal
    │   ├── pacientes.providers.ts   enlaza puerto ↔ adaptador
    │   └── pacientes.routes.ts
    ├── preconsultas/     misma estructura
    ├── tratamientos/     misma estructura (paciente + procedimiento + materia + fechas)
    ├── procedimientos/   catálogo: especializa `shared/catalogo`
    └── materias/         catálogo: especializa `shared/catalogo`
```

- `domain` no depende de Angular HTTP; `infrastructure` implementa los puertos; el enlace se hace en
  `app.config.ts` con `providePacientes()`, `providePreconsultas()`, `provideTratamientos()`,
  `provideProcedimientos()` y `provideMaterias()`.
- `PacientesStore` es global (catálogo usado también por preconsultas). `PreconsultasStore` se
  provee por página, porque cada vista tiene su propia lista/filtro.
- Relación 1:N: la ficha del paciente (`/pacientes/:id`) lista sus preconsultas con
  `GET /api/pacientes/{id}/preconsultas` y permite crearlas con el paciente fijo; el listado general
  de preconsultas permite filtrar por paciente. Eliminar un paciente con preconsultas o tratamientos
  devuelve 409 y se muestra un mensaje explicativo.
- Tratamientos: igual que las preconsultas, se listan en la ficha del paciente
  (`GET /api/pacientes/{id}/tratamientos`) y en `/tratamientos` con filtro por paciente. Cada uno
  tiene procedimiento, materia, fecha de inicio y fecha de finalización opcional (vacía = en curso;
  no puede ser anterior al inicio). Las fechas son `LocalDate` (`yyyy-MM-dd`) y se convierten con
  `aFechaLocal` / `desdeFechaLocal` para no desplazar el día por la zona horaria.
- Procedimientos y materias son catálogos (solo `descripcion`, única). Sus stores son globales
  porque los usan el formulario y la tabla de tratamientos para mostrar las descripciones. Están
  agrupados en el menú bajo "Catálogos"; eliminar uno usado en tratamientos devuelve 409.
- Los formularios de alta/edición se abren en un modal (`shared/ui/formulario-modal.ts`); validan lo
  mismo que el backend y muestran junto a cada campo los errores de validación que devuelve la API.
