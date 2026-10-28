import { Observable } from 'rxjs';
import { Tratamiento, TratamientoDatos } from './tratamiento';

/** Puerto de acceso a los tratamientos; la implementación vive en `infrastructure`. */
export abstract class TratamientoRepository {
  abstract listar(): Observable<Tratamiento[]>;
  abstract listarPorPaciente(pacienteId: number): Observable<Tratamiento[]>;
  abstract obtener(id: number): Observable<Tratamiento>;
  abstract crear(datos: TratamientoDatos): Observable<Tratamiento>;
  abstract actualizar(id: number, datos: TratamientoDatos): Observable<Tratamiento>;
  abstract eliminar(id: number): Observable<void>;
}
