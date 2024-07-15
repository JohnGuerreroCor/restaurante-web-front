import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { environment } from 'src/environments/environment';
import { Observable, catchError, throwError } from 'rxjs';
import { GrupoGabu } from '../models/grupoGabu';

@Injectable({
  providedIn: 'root'
})
export class GrupoGabuService {

  private url: string = `${environment.URL_BACKEND}`;
  private httpHeaders = new HttpHeaders({ 'Content-type': 'application/json' });
  private sedeCodigo: number = 645;
  private fecha = new Date().toISOString().split('T')[0];



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

  obtenerGabu(codigo: number): Observable<GrupoGabu[]> {
    return this.http
      .get<GrupoGabu[]>(`${this.url}/grupoGabu/obtener-grupoGabu/${this.userLogeado}/${codigo}`, {
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
