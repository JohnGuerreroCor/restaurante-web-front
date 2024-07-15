import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { DiaBeneficio } from '../models/diaBeneficio';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class DiaBeneficioService {

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

  obtenerDiasBeneficio(codigoGabu: number): Observable<DiaBeneficio[]> {
    return this.http
      .get<DiaBeneficio[]>(`${this.url}/diaBeneficio/obtener-diaBeneficio/${this.userLogeado}/${codigoGabu}`, {
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
