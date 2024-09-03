import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { environment } from 'src/environments/environment';
import { UbicacionService } from '../../services/ubicacion.service';
import { EstamentoService } from 'src/app/services/estamento.service';
import { Estamento } from 'src/app/models/estamento';
import { BehaviorSubject, fromEvent, Observable, Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { WebparametroService } from 'src/app/services/webparametro.service';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css'],
})
export class InicioComponent implements OnInit {
  links = [
    {
      titulo: 'Venta',
      ruta: '/ventaTiquetes',
      icono: 'fa-solid fa-shop fa-8x p-4 text-center color-icon color-icon',
      info: 'Este módulo se encarga de establecer los horarios de venta y atención en el restaurante, garantizando una gestión eficiente del tiempo.',
    },
    {
      titulo: 'Consumo',
      ruta: '/consumoTiquetes',
      icono: 'fa-solid fa-utensils fa-8x p-4 text-center color-icon',
      info: 'Actualmente en construcción, este módulo en el futuro será responsable de llevar un registro histórico de las ventas y consumos para un determinado día.',
    },
    {
      titulo: 'Cargue informacion',
      ruta: '/cargueInformacion',
      icono: 'fa-solid fa-truck-ramp-box fa-8x p-4 text-center color-icon',
      info: 'Módulo dedicado a la parametrización contractual, gestionando contratos vigentes, pasados y futuros.',
    },
    {
      titulo: 'Estadísticas',
      ruta: '/estadisticas-restaurante',
      icono: 'fa-solid fa-chart-pie fa-8x p-4 text-center color-icon',
      info: 'Módulo dedicado a la parametrización contractual, gestionando contratos vigentes, pasados y futuros.',
    },
    {
      titulo: 'Reportes',
      ruta: '/reporte',
      icono: 'fa-solid fa-file-csv fa-8x p-4 text-center color-icon',
      info: 'Módulo dedicado a la parametrización contractual, gestionando contratos vigentes, pasados y futuros.',
    },
  ];

  public perCodigo: number = this.auth.user.personaCodigo;

  resizeObservable!: Observable<Event>;
  resizeSubscription!: Subscription;

  mobile: boolean = false;
  carnetEstudiante: boolean = false;
  carnetGraduado: boolean = false;
  carnetAdministrativo: boolean = false;
  carnetDocente: boolean = false;
  carnetVirtual: boolean = false;
  carnetIntercambio: boolean = false;

  carnets: Estamento[] = [];

  anio!: number;
  fecha = new Date();
  url: string = environment.URL_BACKEND;

  constructor(
    public auth: AuthService,
    public estamentoService: EstamentoService,
    private router: Router,
    public ubicacionService: UbicacionService
  ) {}

  ngOnInit() {
    if (!this.auth.isAuthenticated()) {
      this.router.navigate(['/login']);
    } else {
      this.obtenerSedes();
    }
    this.anio = this.fecha.getUTCFullYear();

    if (window.screen.width <= 950) {
      // 768px portrait
      this.mobile = true;
    } else {
      this.mobile = false;
    }
    this.resizeObservable = fromEvent(window, 'resize');
    this.resizeSubscription = this.resizeObservable.subscribe((evt) => {
      if (window.screen.width <= 950) {
        // 768px portrait
        this.mobile = true;
      } else {
        this.mobile = false;
      }
    });
  }

  obtenerSedes() {
    this.ubicacionService.obtenerSedes().subscribe();
  }

  mensajeError() {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Ocurrio Un Error!',
    });
  }

  mensajeSuccses() {
    Swal.fire({
      icon: 'success',
      title: 'Proceso Realizado',
      showConfirmButton: false,
      timer: 1500,
    });
  }

  fError(er: any): void {
    let err = er.error.error_description;
    let arr: string[] = err.split(':');

    if (arr[0] == 'Access token expired') {
      this.auth.logout();
      this.router.navigate(['login']);
    } else {
      this.mensajeError();
    }
  }
}
