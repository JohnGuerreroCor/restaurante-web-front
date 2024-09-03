import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';
import { Observable, catchError, throwError } from 'rxjs';
import { ReporteVenta } from '../models/reporte-venta';

@Injectable({
  providedIn: 'root',
})
export class ReportesService {
  private url: string = `${environment.URL_BACKEND}/reportes`;
  private httpHeaders = new HttpHeaders({ 'Content-type': 'application/json' });
  private sedeCodigo: number = this.authservice.user.uaaCodigo;

  userLogeado: String = this.authservice.user.username;

  constructor(
    private http: HttpClient,
    private router: Router,
    private authservice: AuthService
  ) {}

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

  obtenerReporteVentas(): Observable<ReporteVenta[]> {
    return this.http
      .get<ReporteVenta[]>(
        `${this.url}/obtener-reporte-ventas`,
        {
          headers: this.aggAutorizacionHeader(),
        }
      )
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
