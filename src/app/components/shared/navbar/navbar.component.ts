import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AuthService } from 'src/app/services/auth.service';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { NavbarHiddenService } from 'src/app/services/navbar-hidden.service';
import { FotoService } from 'src/app/services/foto.service';
import { FotoAntigua } from 'src/app/models/foto-antigua';
import { formatDate } from '@angular/common';
import swal from 'sweetalert2';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  public perCodigo: any = this.auth.user.personaCodigo;
  public nombre: any = this.auth.user.personaNombre;
  public apellido: any = this.auth.user.personaApellido;
  public horaInicioSesion: any = this.auth.user.horaInicioSesion;
  public horaFinSesion: any = this.auth.user.horaInicioSesion;
  carnetEstudiante: boolean = false;
  carnetGraduado: boolean = false;
  carnetAdministrativo: boolean = false;
  carnetDocente: boolean = false;
  carnetVirtual: boolean = false;
  carnetIntercambio: boolean = false;

  url: string = environment.URL_BACKEND;
  panelOpenState = false;
  foto: FotoAntigua = {
    url: '',
  };

  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(
      map((result) => result.matches),
      shareReplay()
    );

  constructor(
    private breakpointObserver: BreakpointObserver,
    public auth: AuthService,
    private router: Router,
    public navbarHiddenService: NavbarHiddenService,
    public fotoService: FotoService
  ) {
    this.fotoService.mirarFoto('' + this.perCodigo).subscribe((data) => {
      var gg = new Blob([data], { type: 'application/json' });
      if (gg.size !== 4) {
        var blob = new Blob([data], { type: 'image/png' });
        const foto = blob;
        const reader = new FileReader();
        reader.onload = () => {
          this.foto.url = reader.result as string;
        };
        reader.readAsDataURL(foto);
      } else {
        this.fotoService
          .mirarFotoAntigua('' + this.perCodigo)
          .subscribe((data) => {
            this.foto = data;
          });
      }
    });
  }

  scroll(page: HTMLElement) {
    page.scrollIntoView();
  }

  logout(): void {
    this.auth.logout();
    const Toast = swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', swal.stopTimer);
        toast.addEventListener('mouseleave', swal.resumeTimer);
      },
    });

    Toast.fire({
      icon: 'success',
      title: 'Sesión cerrada correctamente.',
    });
    this.router.navigate(['/login']);
  }

  ngOnInit() {
    // Convertir la cadena de horaInicioSesion a un objeto de fecha
    let horaInicioSesionDate = new Date(this.horaInicioSesion + 'Z');

    // Sumar dos horas a la hora de inicio de sesión
    horaInicioSesionDate.setHours(horaInicioSesionDate.getHours() + 5);

    // Convertir la nueva hora a una cadena en el mismo formato
    this.horaFinSesion = horaInicioSesionDate
      .toISOString()
      .slice(0, 19)
      .replace('T', ' ');

    let finSesion = new Date(this.horaFinSesion);

    // Calcular la diferencia en milisegundos entre la hora de fin de sesión y la hora actual
    let diferenciaTiempo = finSesion.getTime() - Date.now();

    // Si faltan 10 minutos o menos para la hora de fin de sesión, mostrar SweetAlert
    if (diferenciaTiempo <= 10 * 60 * 1000) {
      // 10 minutos en milisegundos
      swal
        .fire({
          title: '¡Atención!',
          text: 'Tu sesión está a punto de terminar.',
          icon: 'warning',
          confirmButtonText: 'Entendido',
          confirmButtonColor: '#8f141b',
          timer: 5000, // Mostrar alerta durante 5 segundos
          timerProgressBar: true,
          allowOutsideClick: false,
        })
        .then((result) => {
          if (result.dismiss === swal.DismissReason.timer) {
            // Cerrar sesión si se confirma o si se agota el tiempo del timer
            this.logout();
          }
        });
    }
  }

  informacion() {
    const horaInicioFormateada = formatDate(
      this.horaInicioSesion,
      'dd-MM-yyyy, h:mm a',
      'en-US'
    );
    const horaFinFormateada = formatDate(
      this.horaFinSesion,
      'dd-MM-yyyy, h:mm a',
      'en-US'
    );

    swal.fire({
      title: 'Información de inicio de sesión',
      html: ` 
        <hr style="border-bottom: dashed 1px #222d32;" />      
        <small><b>HORA INICIO SESIÓN: </b><br /> ${horaInicioFormateada} </small>      
        <hr style="border-bottom: dashed 1px #222d32;" />        
        <small><b>HORA FINALIZACIÓN: </b><br /> ${horaFinFormateada} </small>
        <hr style="border-bottom: dashed 1px #222d32;" />    
      `,
      showConfirmButton: true,
      confirmButtonText: 'Listo',
      confirmButtonColor: '#8f141b',
    });
  }

  toggle() {
    this.navbarHiddenService.toggleSideBar();
  }
}
