export interface Preconsulta {
  id: number;
  /** Paciente al que pertenece (relación N:1 con pacientes). */
  pacienteId: number;
  /** `LocalDateTime` del backend, p. ej. `2026-09-30T09:15:00`. */
  fechaHora: string;
  /** mmHg; debe ser mayor que la diastólica. */
  presionSistolica: number;
  /** mmHg */
  presionDiastolica: number;
  /** Latidos por minuto */
  frecuenciaCardiaca: number;
  /** °C, con un decimal */
  temperatura: number;
}

/**
 * Datos para registrar o actualizar una preconsulta (`PreconsultaRequest`). Si `fechaHora` se
 * omite, el backend usa el momento actual al crear y conserva la registrada al actualizar.
 */
export type PreconsultaDatos = Omit<Preconsulta, 'id' | 'fechaHora'> & { fechaHora?: string };

/** Rangos aceptados por el backend. */
export const LIMITES = {
  presionSistolica: { min: 50, max: 300 },
  presionDiastolica: { min: 20, max: 200 },
  frecuenciaCardiaca: { min: 20, max: 250 },
  temperatura: { min: 30, max: 45 },
} as const;

/** Mismo orden que devuelve el backend: de la más reciente a la más antigua. */
export const compararPreconsultas = (a: Preconsulta, b: Preconsulta) =>
  b.fechaHora.localeCompare(a.fechaHora) || b.id - a.id;
