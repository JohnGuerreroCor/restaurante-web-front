import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PublickeyService {

  private url: string = `${environment.URL_BACKEND}/api`;
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

  createkeys() {
    return this.http
      .get<any>(`${this.url}/createKeys`, {
        headers: this.aggAutorizacionHeader(),
        responseType: 'text' as 'json'
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

  encrpyt(data: string) {
    return this.http.post<string>(
      `${this.url}/encrypt`,
      data,
      { headers: this.aggAutorizacionHeader(), responseType: 'text' as 'json' }
    );
  }

  decrpyt(data: string) {
    return this.http.post<string>(
      `${this.url}/decrypt`,
      data,
      { headers: this.aggAutorizacionHeader(), responseType: 'text' as 'json' }
    );
  }

  
}
