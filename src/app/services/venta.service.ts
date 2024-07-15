import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';
import { HorarioServicio } from '../models/horarioServicio';
import { Observable, catchError, throwError } from 'rxjs';
import { DiasHorarioServicio } from '../models/diasHorarioServicio';
import { Venta } from '../models/venta';

@Injectable({
  providedIn: 'root'
})
export class VentaService {

  private url: string = `${environment.URL_BACKEND}`;
  private httpHeaders = new HttpHeaders({ 'Content-type': 'application/json' });

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

  obtenerVentasByPerCodigo(codigoPersona: number, codigoContrato: number): Observable<Venta[]> {
    return this.http
      .get<Venta[]>(`${this.url}/venta/obtener-venta/${this.userLogeado}/${codigoPersona}/${codigoContrato}`, {
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

  obtenerVentasDiarias(codigoTipoServicio: number, codigoContrato: number): Observable<number> {
    return this.http
      .get<number>(`${this.url}/venta/obtener-ventas-diarias/${codigoTipoServicio}/${codigoContrato}`, {
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

  registrarVentas(ventas: Venta[]): Observable<number> {
    return this.http.post<number>(
      `${this.url}/venta/crear-ventas/${this.userLogeado}`,
      ventas,
      { headers: this.aggAutorizacionHeader() }
    );
  }

  cargueVentas(ventas: Venta[]): Observable<number[]> {
    return this.http.post<number[]>(
      `${this.url}/venta/cargue-informacion/${this.userLogeado}`,
      ventas,
      { headers: this.aggAutorizacionHeader() }
    );
  }

  actualizarVenta(venta: Venta): Observable<number> {
    return this.http.put<number>(
      `${this.url}/venta/actualizar-venta/${this.userLogeado}`,
      venta,
      { headers: this.aggAutorizacionHeader() }
    );
  }

}
