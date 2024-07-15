import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';
import { Observable, catchError, throwError } from 'rxjs';
import { DiasHorarioServicio } from '../models/diasHorarioServicio';
import { HorarioServicio } from '../models/horarioServicio';

@Injectable({
  providedIn: 'root'
})
export class HorarioServicioService {

  private url: string = `${environment.URL_BACKEND}`;
  private httpHeaders = new HttpHeaders({ 'Content-type': 'application/json' });
  private sedeCodigo: number = this.authservice.user.uaaCodigo;

  userLogeado: String = this.authservice.user.username;

  constructor(
    private http: HttpClient,
    private router: Router,
    private authservice: AuthService
  ) { }

  private aggAutorizacionHeader(): HttpHeaders {
    let token = this.authservice.Token;
    if (token != null) {
      return this.httpHeaders.append('Authorization', 'Bearer ' + token);
    }
    return this.httpHeaders;
  }

  private isNoAutorizado(e: { status: number }): boolean {
    if (e.status == 401 || e.status == 403) {
      if (this.authservice.isAuthenticated()) {
        this.authservice.logout();
      }
      this.router.navigate(['login']);
      return true;
    }
    return false;
  }

  obtenerHorariosServicio(): Observable<HorarioServicio[]> {

    return this.http
      .get<HorarioServicio[]>(`${this.url}/horarioServicio/obtener-horarioServicio/${this.userLogeado}/${this.sedeCodigo}`, {
        headers: this.aggAutorizacionHeader(),
      })
      .pipe(
        catchError((e) => {
          if (this.isNoAutorizado(e)) {
            return throwError(e);
          }
          return throwError(e);
        })
      );
  }

  crearHorarioServicio(horarioServicio: HorarioServicio): Observable<number> {
    return this.http.post<number>(
      `${this.url}/horarioServicio/crear-horarioServicio/${this.userLogeado}`,
      horarioServicio,
      { headers: this.aggAutorizacionHeader() }
    );
  }

  actualizarHorarioServicio(horarioServicio: HorarioServicio): Observable<number> {
    return this.http.put<number>(
      `${this.url}/horarioServicio/actualizar-horarioServicio/${this.userLogeado}`,
      horarioServicio,
      { headers: this.aggAutorizacionHeader() }
    );
  }

  obtenerDiasHorarioServicio(): Observable<DiasHorarioServicio[]> {
    return this.http
      .get<[DiasHorarioServicio]>(`${this.url}/diaHorarioServicio/obtener-horarioServicio/${this.userLogeado}`, {
        headers: this.aggAutorizacionHeader(),
      })
      .pipe(
        catchError((e) => {
          if (this.isNoAutorizado(e)) {
            return throwError(e);
          }
          return throwError(e);
        })
      );
  }

}
