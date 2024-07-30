import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { FotoAntigua } from '../models/foto-antigua';

@Injectable({
  providedIn: 'root',
})
export class FotoService {
  private url: string = `${environment.URL_BACKEND}/foto`;
  private httpHeaders = new HttpHeaders();

  private uaa = this.authservice.obtenerUaa();

  private perCodigo = this.authservice.user.personaCodigo;

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

  mirarFoto(perCodigo: String): Observable<any> {
    return this.http.get<any>(
      `${this.url}/obtener-foto/${this.userLogeado}/${perCodigo}`,
      { headers: this.aggAutorizacionHeader(), responseType: 'blob' as 'json' }
    );
  }

  mirarFotoAntigua(perCodigo: String): Observable<FotoAntigua> {
    return this.http.get<FotoAntigua>(
      `${this.url}/obtener-foto-antigua/${this.userLogeado}/${perCodigo}`,
      { headers: this.aggAutorizacionHeader() }
    );
  }
}
