import { RestauranteRaciones } from './../models/restaurante-raciones';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';
import { RestauranteVenta } from '../models/restaurante-venta';
import { RestauranteSedes } from '../models/restaurante-sedes';
import { RestauranteTiquetes } from '../models/restaurante-tiquetes';

@Injectable({
  providedIn: 'root',
})
export class EstadisticaRestauranteService {
  private url: string = `${environment.URL_BACKEND}/restaurante`;
  private httpHeaders = new HttpHeaders({ 'Content-type': 'application/json' });

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

  private isNoAutorizado(e: any): boolean {
    if (e.status == 401 || e.status == 403) {
      if (this.authservice.isAuthenticated()) {
        this.authservice.logout();
      }
      this.router.navigate(['login']);
      return true;
    }
    return false;
  }

  obtenerSedesRestaurante(): Observable<RestauranteSedes[]> {
    return this.http.get<RestauranteSedes[]>(
      `${this.url}/obtener-sedes-restaurante`,
      { headers: this.aggAutorizacionHeader() }
    );
  }

  obtenerBoletos(codigo: number): Observable<RestauranteVenta[]> {
    return this.http.get<RestauranteVenta[]>(
      `${this.url}/obtener-boletas/${codigo}`,
      { headers: this.aggAutorizacionHeader() }
    );
  }

  obtenerRacionesDisponibles(
    codigo: number
  ): Observable<RestauranteRaciones[]> {
    return this.http.get<RestauranteRaciones[]>(
      `${this.url}/obtener-raciones-disponibles/${codigo}`,
      { headers: this.aggAutorizacionHeader() }
    );
  }

  obtenerTiquetesDisponibles(
    codigo: number
  ): Observable<RestauranteTiquetes[]> {
    return this.http.get<RestauranteTiquetes[]>(
      `${this.url}/obtener-tiquetes-disponibles/${codigo}`,
      { headers: this.aggAutorizacionHeader() }
    );
  }
}
