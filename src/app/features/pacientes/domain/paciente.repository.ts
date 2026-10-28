import { Observable } from 'rxjs';
import { Paciente, PacienteDatos } from './paciente';

/** Puerto de acceso a los pacientes; la implementación vive en `infrastructure`. */
export abstract class PacienteRepository {
  abstract listar(): Observable<Paciente[]>;
  abstract obtener(id: number): Observable<Paciente>;
  abstract crear(datos: PacienteDatos): Observable<Paciente>;
  abstract actualizar(id: number, datos: PacienteDatos): Observable<Paciente>;
  abstract eliminar(id: number): Observable<void>;
}
