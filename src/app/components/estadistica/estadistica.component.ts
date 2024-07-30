import { DatePipe } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { RestauranteRaciones } from 'src/app/models/restaurante-raciones';
import { RestauranteSedes } from 'src/app/models/restaurante-sedes';
import { RestauranteTiquetes } from 'src/app/models/restaurante-tiquetes';
import { RestauranteVenta } from 'src/app/models/restaurante-venta';
import { AuthService } from 'src/app/services/auth.service';
import { EstadisticaRestauranteService } from 'src/app/services/estadistica-restaurante.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-estadistica',
  templateUrl: './estadistica.component.html',
  styleUrls: ['./estadistica.component.css'],
  providers: [
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: { subscriptSizing: 'dynamic' },
    },
    DatePipe,
  ],
})
export class EstadisticaComponent implements OnInit, OnDestroy {
  hora!: string;
  intervalo: any;
  raciones: RestauranteRaciones[] = [];
  tiquetes: RestauranteTiquetes[] = [];
  sedes: RestauranteSedes[] = [];
  sede: any;
  hoy = new Date();

  public perCodigo: any = this.auth.user.personaCodigo;
  public perCodigoAntigua: any = '' + this.auth.user.personaCodigo;
  public nombre: any = this.auth.user.personaNombre;
  public apellido: any = this.auth.user.personaApellido;

  boletas: RestauranteVenta[] = [];

  url: string = environment.URL_BACKEND;

  constructor(
    public estadisticaRestauranteService: EstadisticaRestauranteService,
    private auth: AuthService
  ) {}

  obtenerRacionesSedes() {
    this.raciones = [];
    this.estadisticaRestauranteService
      .obtenerRacionesDisponibles(this.sede)
      .subscribe((data) => {
        this.raciones = data;
      });
  }

  obtenerTiquetesSedes() {
    this.tiquetes = [];
    this.estadisticaRestauranteService
      .obtenerTiquetesDisponibles(this.sede)
      .subscribe((data) => {
        if (JSON.stringify(data) != '[]') {
          this.tiquetes = data;
        }
      });
  }

  actualizarDatos() {
    this.obtenerTiquetesSedes();
    this.obtenerRacionesSedes();
  }

  private actualizarHora() {
    const ahora = new Date();
    this.hora = `${this.agregarCero(ahora.getHours())}:${this.agregarCero(
      ahora.getMinutes()
    )}:${this.agregarCero(ahora.getSeconds())}`;
  }

  private agregarCero(numero: number): string {
    return numero < 10 ? `0${numero}` : `${numero}`;
  }

  obtenerBoletos() {
    this.estadisticaRestauranteService
      .obtenerBoletos(this.auth.user.personaCodigo)
      .subscribe((data) => {
        if (JSON.stringify(data) != '[]') {
          this.boletas = data;
        } else {
          this.boletas = [];
        }
      });
  }

  ngOnInit() {
    this.estadisticaRestauranteService
      .obtenerSedesRestaurante()
      .subscribe((data) => {
        this.sedes = data;
      });
    this.actualizarHora();
    setInterval(() => this.actualizarHora(), 1000); // Actualizar cada segundo

    // Actualizar raciones y tiquetes cada minuto
    this.actualizarDatos(); // Actualización inicial
    this.intervalo = setInterval(() => this.actualizarDatos(), 60000);
    
    this.obtenerBoletos();
  }

  ngOnDestroy() {
    if (this.intervalo) {
      clearInterval(this.intervalo); // Limpiar el intervalo al destruir el componente
    }
  }
}
