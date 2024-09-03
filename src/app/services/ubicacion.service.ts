import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators'
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';
import { Sede } from '../models/sede';
import { SubSede } from '../models/sub-sede';


@Injectable({
  providedIn: 'root'
})
export class UbicacionService {
  private url: string = `${environment.URL_BACKEND}/ubicacion`;
  private httpHeaders = new HttpHeaders({ 'Content-type': 'application/json' });

  userLogeado: String = this.authservice.user.username;

  constructor(private http: HttpClient, private router: Router,
    private authservice: AuthService) { }

  private aggAutorizacionHeader(): HttpHeaders {
    let token = this.authservice.Token;
    if (token != null) {
      return this.httpHeaders.append('Authorization', 'Bearer ' + token);
    }
    return this.httpHeaders;
  }

  private isNoAutorizado(e: { status: number; }): boolean {
    if (e.status == 401 || e.status == 403) {
      if (this.authservice.isAuthenticated()) {
        this.authservice.logout();
      }
      this.router.navigate(['login']);
      return true;
    }
    return false;
  }


  obtenerSedes(): Observable<Sede[]> {
    return this.http.get<Sede[]>(`${this.url}/obtener-sedes/${this.userLogeado}`, { headers: this.aggAutorizacionHeader() }).pipe(
      catchError(e => {
        if (this.isNoAutorizado(e)) {
          return throwError(e);
        }
        return throwError(e);
      })
    );
  }

  obtenerSubSedes(): Observable<SubSede[]> {
    return this.http.get<SubSede[]>(`${this.url}/obtener-subsedes/${this.userLogeado}`, { headers: this.aggAutorizacionHeader() }).pipe(
      catchError(e => {
        if (this.isNoAutorizado(e)) {
          return throwError(e);
        }
        return throwError(e);
      })
    );
  }


  buscarSubSedes(codigo: number): Observable<SubSede[]> {
    return this.http.get<SubSede[]>(`${this.url}/buscar-subsede/${codigo}/${this.userLogeado}`, { headers: this.aggAutorizacionHeader() });
  }

}