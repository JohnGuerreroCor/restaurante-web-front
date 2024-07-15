import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { Estamento } from '../models/estamento';
import { CarnetDigital } from '../models/carnet-digital';

@Injectable({
  providedIn: 'root'
})
export class EstamentoService {

  private url: string = `${environment.URL_BACKEND}/estamentos`;
  private httpHeaders = new HttpHeaders()

  userLogeado: String = this.authservice.user.username;

  constructor(
    private http: HttpClient,
    private authservice: AuthService
  ) { }
  private aggAutorizacionHeader(): HttpHeaders {
    let token = this.authservice.Token;
    if (token != null) {
      return this.httpHeaders.append('Authorization', 'Bearer ' + token);
    }
    return this.httpHeaders;
  }


}