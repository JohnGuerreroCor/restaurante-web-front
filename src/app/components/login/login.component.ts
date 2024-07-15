import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { Usuario } from '../../models/usuario';
import swal from 'sweetalert2';
import { WebparametroService } from 'src/app/services/webparametro.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  // Modelo para almacenar los datos del usuario del formulario de inicio de sesión
  usuario: Usuario;

  // Booleano para ocultar/mostrar la contraseña
  hide = true;

  // Booleano para mostrar/ocultar un componente específico en la plantilla
  ver = true;

  // Objeto Date que representa la fecha actual
  today = new Date();

  // Booleano para indicar si la autenticación está en progreso
  cargando: boolean = false;

  // Formulario Reactivo que maneja los campos de inicio de sesión
  formLogin!: FormGroup;

  constructor(
    public authService: AuthService,
    public webparametroService: WebparametroService,
    private router: Router,
    private formBuilder: FormBuilder
  ) {
    // Inicializar el modelo de usuario
    this.usuario = new Usuario();
  }

  ngOnInit() {
    // Crear el formulario de inicio de sesión
    this.crearFormularioLogin();

    // Obtener un parámetro web específico del servicio webparametroService
    this.webparametroService.obtenerWebParametro().subscribe((data) => { });

    // Si el usuario ya ha iniciado sesión, redirigirlo a la página de inicio o de token según el caso
    if (this.authService.isAuthenticated()) {
      if (this.authService.codigoverificacion != null) {
        // Mostrar un mensaje de notificación si ya se ha iniciado sesión con un token de verificación
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
          icon: 'info',
          title: 'Ya se ha iniciado sesión.',
        });

        // Redirigir al usuario a la página de inicio
        this.router.navigate(['inicio']);
      } else {
        // Redirigir al usuario a la página de inicio o de token según el valor del parámetro web
        this.webparametroService.obtenerWebParametro().subscribe((data) => {
          if (data[0].webValor === '1') {
            this.router.navigate(['/login']);
          } else {
            this.router.navigate(['/inicio']);
          }
        });
      }
    }
  }

  // Método privado para crear el formulario de inicio de sesión utilizando el FormBuilder
  private crearFormularioLogin(): void {
    this.formLogin = this.formBuilder.group({
      // Campo para el nombre de usuario, con validador de obligatorio
      usuario: new FormControl('', Validators.required),

      // Campo para la contraseña, con validador de obligatorio
      contrasenia: new FormControl('', Validators.required),
    });
  }

  // Método para mostrar información sobre los tipos de usuario de USCO mediante una alerta de SweetAlert2
  informacion() {
    swal.fire({
      icon: 'info',
      title: 'Tipos de Usuario USCO',
      imageUrl: 'assets/tipousuariousco2.png',
      imageWidth: 400,
      imageHeight: 280,
      imageAlt: 'USCO',
      confirmButtonColor: '#8f141b',
      confirmButtonText: 'Listo',
      showClass: {
        popup: 'slide-top',
      },
    });
  }

  // Método para realizar el inicio de sesión del usuario
  login(): void {
    this.cargando = true;
    this.usuario.username = this.formLogin.get('usuario')!.value;
    this.usuario.password = this.formLogin.get('contrasenia')!.value;

    // Validar que no se ingresen campos de inicio de sesión vacíos
    if (this.usuario.username == null || this.usuario.password == null) {
      const Toast = swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.addEventListener('mouseenter', swal.stopTimer);
          toast.addEventListener('mouseleave', swal.resumeTimer);
        },
      });

      // Mostrar un mensaje de error si se ingresan campos vacíos
      Toast.fire({
        icon: 'error',
        title: 'Error de inicio de sesión',
        text: 'Usuario o contraseña vacía',
      });

      this.cargando = false;
      return;
    }

    // Realizar la solicitud de inicio de sesión al servicio authService
    this.authService.login(this.usuario).subscribe(
      (response) => {
        // Si el inicio de sesión es exitoso, guardar el token y redirigir al usuario según el valor del parámetro web
        this.authService.guardarUsuario(response.access_token);
        this.authService.guardarToken(response.access_token);

        // Mostrar mensaje de éxito y redirigir
        const Toast = swal.mixin({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.addEventListener('mouseenter', swal.stopTimer)
            toast.addEventListener('mouseleave', swal.resumeTimer)
          }
        });
    
        Toast.fire({
          icon: 'success',
          title: 'Inicio de sesión exitoso.'
        });

        // Redirigir al usuario a la página de inicio o de token según el valor del parámetro web
        this.router.navigate(['/token']);
      },
      (err) => this.fError(err)
    );
  }

  // Método para manejar errores de inicio de sesión
  fError(er: { error: { error_description: any } }): void {
    let err = er.error.error_description;
    let arr: string[] = err.split(':');
    if (arr[0] == 'Access token expired') {
      // Si el token de acceso ha expirado, redirigir al usuario a la página de inicio de sesión
      this.router.navigate(['login']);
      this.cargando = false;
    } else {
      // Manejo de otros errores
      this.cargando = false;
    }
  }
}
