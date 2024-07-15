import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router, NavigationExtras } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { TokenService } from 'src/app/services/token.service';
import swal from 'sweetalert2';
import { Correo } from 'src/app/models/correo';

@Component({
  selector: 'app-token',
  templateUrl: './token.component.html',
  styleUrls: ['./token.component.css'],
})
export class TokenComponent implements OnInit {
  correo: any;
  codigo!: String;
  codioCorrecto!: String;
  today = new Date();
  cargando: boolean = false;
  @Output() rolEvent = new EventEmitter<any>();
  formToken!: FormGroup;

  constructor(
    public auth: AuthService,
    private router: Router,
    public tokenService: TokenService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.crearFormularioToken();
    this.tokenService.gettokenUsco().subscribe((correo) => {
      if (JSON.stringify(correo) === '[]') {
        this.router.navigate(['/login']);
      } else {
        this.correo = correo;
      }
    });
  }

  private crearFormularioToken(): void {
    this.formToken = this.formBuilder.group({
      token: new FormControl('', Validators.required),
    });
  }

  validarToken() {
    this.cargando = true;
    if (this.formToken.get('token')!.value) {
      this.tokenService
        .validartokenUsco(this.formToken.get('token')!.value)
        .subscribe(
          (response) => {
            this.auth.guardarCodigoverificacion('true');
            swal.fire({
              icon: 'success',
              title: 'Inicio de sesión exitoso.',
              confirmButtonColor: '#8f141b',
              confirmButtonText: 'Listo',
              showClass: {
                popup: 'slide-top',
              },
            });
            this.router.navigate(['/inicio']);
          },
          (err) => this.fError(err)
        );
    }
  }

  fError(er: any): void {
    this.cargando = false;
    let err = er.error.error_description;
    let arr: string[] = err.split(':');
    if (arr[0] == 'Access token expired') {
      this.router.navigate(['/login']);
      this.cargando = false;
    } else {
      this.cargando = false;
    }
  }
}
