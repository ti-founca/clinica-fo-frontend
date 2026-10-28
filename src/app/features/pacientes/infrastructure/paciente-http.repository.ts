import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URL } from '../../../core/config/api-url';
import { Paciente, PacienteDatos } from '../domain/paciente';
import { PacienteRepository } from '../domain/paciente.repository';

@Injectable()
export class PacienteHttpRepository extends PacienteRepository {
  private readonly http = inject(HttpClient);
  private readonly url = `${inject(API_URL)}/api/pacientes`;

  listar(): Observable<Paciente[]> {
    return this.http.get<Paciente[]>(this.url);
  }

  obtener(id: number): Observable<Paciente> {
    return this.http.get<Paciente>(`${this.url}/${id}`);
  }

  crear(datos: PacienteDatos): Observable<Paciente> {
    return this.http.post<Paciente>(this.url, datos);
  }

  actualizar(id: number, datos: PacienteDatos): Observable<Paciente> {
    return this.http.put<Paciente>(`${this.url}/${id}`, datos);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
