import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URL } from '../../../core/config/api-url';
import { Tratamiento, TratamientoDatos } from '../domain/tratamiento';
import { TratamientoRepository } from '../domain/tratamiento.repository';

@Injectable()
export class TratamientoHttpRepository extends TratamientoRepository {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = inject(API_URL);
  private readonly url = `${this.apiUrl}/api/tratamientos`;

  listar(): Observable<Tratamiento[]> {
    return this.http.get<Tratamiento[]>(this.url);
  }

  listarPorPaciente(pacienteId: number): Observable<Tratamiento[]> {
    return this.http.get<Tratamiento[]>(`${this.apiUrl}/api/pacientes/${pacienteId}/tratamientos`);
  }

  obtener(id: number): Observable<Tratamiento> {
    return this.http.get<Tratamiento>(`${this.url}/${id}`);
  }

  crear(datos: TratamientoDatos): Observable<Tratamiento> {
    return this.http.post<Tratamiento>(this.url, datos);
  }

  actualizar(id: number, datos: TratamientoDatos): Observable<Tratamiento> {
    return this.http.put<Tratamiento>(`${this.url}/${id}`, datos);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
