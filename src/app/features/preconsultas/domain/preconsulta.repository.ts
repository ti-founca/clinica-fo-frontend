import { Observable } from 'rxjs';
import { Preconsulta, PreconsultaDatos } from './preconsulta';

/** Puerto de acceso a las preconsultas; la implementación vive en `infrastructure`. */
export abstract class PreconsultaRepository {
  abstract listar(): Observable<Preconsulta[]>;
  abstract listarPorPaciente(pacienteId: number): Observable<Preconsulta[]>;
  abstract obtener(id: number): Observable<Preconsulta>;
  abstract crear(datos: PreconsultaDatos): Observable<Preconsulta>;
  abstract actualizar(id: number, datos: PreconsultaDatos): Observable<Preconsulta>;
  abstract eliminar(id: number): Observable<void>;
}
