import { Component, OnDestroy } from '@angular/core';
import { Contrato } from 'src/app/models/contrato';
import { Estudiante } from 'src/app/models/estudiante';
import { AuthService } from 'src/app/services/auth.service';
import { ContratoService } from 'src/app/services/contrato.service';
import { EstudianteService } from 'src/app/services/estudiante.service';
import { HoraServidorService } from 'src/app/services/hora-servidor.service';
import { PublickeyService } from 'src/app/services/publickey.service';
import { VentaService } from 'src/app/services/venta.service';
import { WebparametroService } from 'src/app/services/webparametro.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-tiquetes-qr',
  templateUrl: './tiquetes-qr.component.html',
  styleUrls: ['./tiquetes-qr.component.css']
})
export class TiquetesQrComponent implements OnDestroy {

  constructor(
    private publicKeyService: PublickeyService,
    private horaServidorService: HoraServidorService,
    private authservice: AuthService,
    private estudianteService: EstudianteService,
    private ventaService: VentaService,
    private contratoService: ContratoService,
    private webParametroService: WebparametroService
  ) { }

  mensajeEncriptadoServer: string = "";
  horaFecha!: Date;
  userLogeado: string = this.authservice.user.username;
  contratoVigente: Contrato = new Contrato();
  tiquetesComprados: number[] = [0, 0, 0];
  estudiante: Estudiante = new Estudiante();
  urlQR: string = "https://www.usco.edu.co/imagen-institucional/logo/precarga-usco.gif";
  VIGENCIA_E_TICKET: number = 0;
  isQRInit = false;
  intervalId: any;
  uaa: number = this.authservice.user.uaaCodigo;

  ngOnInit(): void {
    this.webParametroService.obtenerWebParametro().subscribe(
      webParametro => {
        this.VIGENCIA_E_TICKET = parseInt(webParametro[1].webValor);
        this.contratoService.obtenerContratoByVigencia().subscribe(
          contrato => {

            if (contrato.length === 0) {
              Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se encontró un contrato vigente'
              })
              return;
            }

            this.contratoVigente = contrato[0];
            const codeWithoutU = this.userLogeado.replace(/\D/g, '');
            this.estudianteService.getEstudiante(codeWithoutU).subscribe(
              persona => {
                if (persona.length > 0) {
                  this.estudiante = persona[0];
                  this.obtenerVentasEstudiante(contrato[0].codigo, webParametro[0].estado, persona[0]);
                } else {
                  this.estudianteService.buscarEstudianteIdentifiacion(codeWithoutU).subscribe(
                    persona => {
                      if (persona.length > 0) {
                        this.estudiante = persona[0];
                        this.obtenerVentasEstudiante(contrato[0].codigo, webParametro[0].estado, persona[0]);
                      }
                    }
                  );
                }
              }
            );
          }
        );
      }
    );
  }

  ngOnDestroy(): void {
    // Limpiar el intervalo al destruir el componente
    clearInterval(this.intervalId);
  }

  encriptarInfo(): void {
    const mensajeEnviar = `${this.estudiante.persona.codigo},${this.horaFecha},`;

    this.publicKeyService.encrpyt(mensajeEnviar).subscribe(
      (response) => {
        this.mensajeEncriptadoServer = response.toString();
        this.publicKeyService.decrpyt(response.toString()).subscribe(
          () => {
            this.generarQR();
          }
        );
      }
    );

  }

  generarQR(): void {
    console.log(this.mensajeEncriptadoServer);
    this.urlQR = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${this.mensajeEncriptadoServer}`;
  }

  obtenerVentasEstudiante(codigoContrato: number, webParametroEstado: number, estudiante: Estudiante): void {
    this.ventaService.obtenerVentasByPerCodigo(estudiante.persona.codigo, codigoContrato).subscribe(
      venta => {
        let tiquetesComprados = [0, 0, 0];
        venta.forEach(element => {
          if (element.tipoServicio.codigo >= 1 && element.tipoServicio.codigo <= 3) {
            tiquetesComprados[element.tipoServicio.codigo - 1] += 1;
          }
        });
        this.tiquetesComprados = tiquetesComprados;
        if (webParametroEstado === 1 && !this.isQRInit && Object.keys(estudiante).length !== 0 && tiquetesComprados !== undefined) {
          this.horaServidorService.horaFechaObservable.subscribe((horaFecha: string) => {
            if (horaFecha !== 'No disponible') {
              this.horaFecha = new Date(horaFecha);
              if (!this.isQRInit) {
                this.isQRInit = true;
                this.encriptarInfo();
                this.intervalId = setInterval(() => {
                  //const mensajeEnviar = `${this.estudiante.persona.codigo},${this.horaFecha}`;//${this.tiquetesComprados.toString()}
                  const mensajeEnviar = this.estudiante.persona.codigo + ',' + this.horaFecha;

                  this.publicKeyService.encrpyt(mensajeEnviar).subscribe(
                    (response) => {
                      this.mensajeEncriptadoServer = response.toString();
                      this.generarQR();
                    }
                  );

                }, this.VIGENCIA_E_TICKET * 1000);
              }
            }
          });
        }
      }
    );
  }

  crearLLaves(): void {
    this.publicKeyService.createkeys().subscribe(
      () => {
        console.log("Llaves publicas y privadas creadas.");
      }
    );
  }
}
