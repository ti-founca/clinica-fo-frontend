export interface Paciente {
  id: number;
  nombres: string;
  apellidos: string;
  numeroDocumento: string;
  direccion: string;
  barrio: string;
  ciudad: string;
}

/** Datos para registrar o actualizar un paciente (`PacienteRequest` del backend). */
export type PacienteDatos = Omit<Paciente, 'id'>;

export const nombreCompleto = (p: Pick<Paciente, 'nombres' | 'apellidos'>) =>
  `${p.apellidos}, ${p.nombres}`;

/** Mismo orden que devuelve el backend: apellidos y luego nombres. */
export const compararPacientes = (a: Paciente, b: Paciente) =>
  a.apellidos.localeCompare(b.apellidos) || a.nombres.localeCompare(b.nombres);
