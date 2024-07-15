import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, interval, Observable, catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from './auth.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HoraServidorService {

  private horaFechaSubject = new BehaviorSubject<string>('No disponible'); // BehaviorSubject para mantener el estado actual
  horaFechaObservable: Observable<string> = this.horaFechaSubject.asObservable();

  private url: string = `${environment.URL_BACKEND}`;
  private httpHeaders = new HttpHeaders({ 'Content-type': 'application/json' });

  userLogeado: String = this.authservice.user.username;

  constructor(
    private http: HttpClient,
    private router: Router,
    private authservice: AuthService
  ) {
    // Iniciar el intervalo para obtener la hora y fecha cada segundo
    interval(1000)
      .pipe(
        switchMap(() => this.obtenerFechaHoraActual())
      )
      .subscribe(
        (horaFecha: string) => {
          this.horaFechaSubject.next(horaFecha);
        },
        (error) => {
          console.error('Error al obtener la hora y fecha:', error);
        }
      );
  }

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

  private obtenerFechaHoraActual(): Observable<string> {
    return this.http
      .get(`${this.url}/api/hora`, {
        headers: this.aggAutorizacionHeader(),
        responseType: 'text', // Indica que esperamos una respuesta de tipo texto
      })
      .pipe(
        catchError((error) => {
          if (this.isNoAutorizado(error)) {
            return throwError(error);
          }
          return throwError(error);
        })
      );
  }

}
