import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';
import { Consumo } from '../models/consumo';
import { Observable, catchError, throwError } from 'rxjs';
import { Qr } from '../models/qr';

@Injectable({
  providedIn: 'root'
})
export class ConsumoService {

  private url: string = `${environment.URL_BACKEND}`;
  private httpHeaders = new HttpHeaders({ 'Content-type': 'application/json' });

  userLogeado: String = this.authservice.user.username;
  private sedeCodigo: number = this.authservice.user.uaaCodigo;

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

  obtenerConsumosByPerCodigo(codigoPersona: number, codigoContrato: number): Observable<Consumo[]> {
    return this.http
      .get<Consumo[]>(`${this.url}/consumo/obtener-consumo/${this.userLogeado}/${codigoPersona}/${codigoContrato}`, {
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

  obtenerConsumosDiarios(codigoTipoServicio: number, codigoContrato: number): Observable<number> {
    return this.http
      .get<number>(`${this.url}/consumo/obtener-consumos-diarios/${codigoTipoServicio}/${codigoContrato}`, {
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

  registrarConsumo(consumo: Consumo): Observable<number> {
    return this.http.post<number>(
      `${this.url}/consumo/crear-consumo/${this.userLogeado}`,
      consumo,
      { headers: this.aggAutorizacionHeader() }
    );
  }

  cargueConsumos(consumo: Consumo[]): Observable<number[]> {
    return this.http.post<number[]>(
      `${this.url}/consumo/cargue-informacion/${this.userLogeado}`,
      consumo,
      { headers: this.aggAutorizacionHeader() }
    );
  }

  actualizarConsumo(consumo: Consumo): Observable<number> {
    return this.http.put<number>(
      `${this.url}/consumo/actualizar-consumo/${this.userLogeado}`,
      consumo,
      { headers: this.aggAutorizacionHeader() }
    );
  }

  //reemplazar esto despues ${this.authservice.user.uaa}
  validarConsumo(stringEncriptado: string): Observable<number> {


    /* let asciiArray = [];
    for (let i = 0; i < stringEncriptado.length; i++) {
      asciiArray.push(stringEncriptado.charCodeAt(i));
    } */
    //console.log(asciiArray.toString());
    //stringEncriptado = asciiArray.toString();

    let qr = new Qr();
    qr.mensajeEncriptado = stringEncriptado;

    return this.http.put<number>(
      `${this.url}/consumo/validar-consumo/${this.userLogeado}/${this.sedeCodigo}`,
      qr,
      {
        headers: this.aggAutorizacionHeader(),
        responseType: 'text' as 'json'
      }
    );
  }
}
