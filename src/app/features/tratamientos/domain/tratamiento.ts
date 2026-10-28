export interface Tratamiento {
  id: number;
  /** Paciente que recibe el tratamiento (relación N:1 con pacientes). */
  pacienteId: number;
  /** Procedimiento realizado (catálogo de procedimientos). */
  procedimientoId: number;
  /** Materia de la carrera en la que se realiza (catálogo de materias). */
  materiaId: number;
  /** `LocalDate` del backend, p. ej. `2026-09-01`. */
  fechaInicio: string;
  /** `null` mientras el tratamiento está en curso; no puede ser anterior a `fechaInicio`. */
  fechaFin: string | null;
}

/** Datos para registrar o actualizar un tratamiento (`TratamientoRequest` del backend). */
export type TratamientoDatos = Omit<Tratamiento, 'id'>;

export const enCurso = (t: Pick<Tratamiento, 'fechaFin'>) => t.fechaFin === null;

/** Mismo orden que devuelve el backend: del más reciente al más antiguo según la fecha de inicio. */
export const compararTratamientos = (a: Tratamiento, b: Tratamiento) =>
  b.fechaInicio.localeCompare(a.fechaInicio) || b.id - a.id;
