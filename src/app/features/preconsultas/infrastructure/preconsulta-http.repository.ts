import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URL } from '../../../core/config/api-url';
import { Preconsulta, PreconsultaDatos } from '../domain/preconsulta';
import { PreconsultaRepository } from '../domain/preconsulta.repository';

@Injectable()
export class PreconsultaHttpRepository extends PreconsultaRepository {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = inject(API_URL);
  private readonly url = `${this.apiUrl}/api/preconsultas`;

  listar(): Observable<Preconsulta[]> {
    return this.http.get<Preconsulta[]>(this.url);
  }

  listarPorPaciente(pacienteId: number): Observable<Preconsulta[]> {
    return this.http.get<Preconsulta[]>(`${this.apiUrl}/api/pacientes/${pacienteId}/preconsultas`);
  }

  obtener(id: number): Observable<Preconsulta> {
    return this.http.get<Preconsulta>(`${this.url}/${id}`);
  }

  crear(datos: PreconsultaDatos): Observable<Preconsulta> {
    return this.http.post<Preconsulta>(this.url, datos);
  }

  actualizar(id: number, datos: PreconsultaDatos): Observable<Preconsulta> {
    return this.http.put<Preconsulta>(`${this.url}/${id}`, datos);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
