import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { DocenteService } from '../../services/docente.service';
import { Docente } from '../../models/docente';
import { FotoService } from 'src/app/services/foto.service';
import { FotoAntigua } from '../../models/foto-antigua';
import { PoliticaService } from '../../services/politica.service';
import { PoliticaEstamento } from '../../models/politica-estamento';
import { FirmaDigitalService } from '../../services/firma-digital.service';
import { PersonaService } from 'src/app/services/persona.service';
import { Persona } from 'src/app/models/persona';
import { fromEvent, Observable, Subscription } from "rxjs";
import { FirmaDigital } from '../../models/firma-digital';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import * as CryptoJS from 'crypto-js';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-docente',
  templateUrl: './docente.component.html',
  styleUrls: ['./docente.component.css'],
  providers: [DatePipe],
})
export class DocenteComponent implements OnInit {

  public perCodigo: any = this.auth.user.per_codigo;

  //Booleanos
  alert: boolean = true;
  cargaFoto: boolean = false;
  mobile: boolean = false;
  flipped: boolean = false;

  //Objetos
  docente: Docente[] = [];
  politicaDocente: PoliticaEstamento[] = [];
  rector: FirmaDigital[] = [];
  persona: Persona[] = [];

  //Complementos
  resizeObservable!: Observable<Event>;
  resizeSubscription!: Subscription;
  vistaMobile: String = '';

  codigoQr: any = null;
  codigoQrOnlinePc: any = null;
  codigoQrOnlineMobile: any = null;
  busqueda!: String;
  url: string = environment.URL_BACKEND;

  foto: FotoAntigua = {
    url: "",
  };
  firma: FotoAntigua = {
    url: "",
  };

  constructor(
    public docenteService: DocenteService,
    public fotoService: FotoService,
    public politicaService: PoliticaService,
    public personaService: PersonaService,
    public firmaService: FirmaDigitalService,
    private datePipe: DatePipe,
    private auth: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    if (window.screen.width <= 950) { // 768px portrait
      this.mobile = true;
    } else {
      this.mobile = false;
    }
    this.resizeObservable = fromEvent(window, 'resize');
    this.resizeSubscription = this.resizeObservable.subscribe(evt => {
      if (window.screen.width <= 950) { // 768px portrait
        this.mobile = true;
      } else {
        this.mobile = false;
      }
    })
    this.vistaMobile = '' + window.screen.width;
    this.personaService.obtenerPersonaPorPerCodigo(this.perCodigo).subscribe(data => {
      this.persona = data;
      this.mostrarFoto('' + this.persona[0].codigo);
      this.docenteService.getDocente(this.persona[0].identificacion).subscribe(data => {
        if (JSON.stringify(data) !== "[]") {
          this.docente = data;
          const param1 = '3';
          const param2 = '' + this.persona[0].identificacion;
          const encryptedParams = this.encryptParams(param1, param2);
          let qr = encryptedParams.replace('=', 'igual');
          //this.codigoQr = 'http://localhost:4200/#/publico;key=' + qr;
          this.codigoQr = 'https://gaitana.usco.edu.co/carnet_digital/#/publico;key=' + qr;
          console.log(this.codigoQr);
        } else {
          this.docente = [];
          this.codigoQr = 'Sin resultado';
          Swal.fire({
            icon: 'warning',
            title: 'No existe',
            text: 'La cédula digitada no encontró ningún Docente asociado, por favor rectifique el documento.',
          });
        }
      });
    });
    this.buscarPoliticaEstamento();
    this.buscarFirmaActiva();
  }

  flipCard() {
    this.flipped = !this.flipped;
  }

  encryptParams(param1: string, param2: string): string {
    const currentDate: any = this.datePipe.transform(new Date(), 'dd-MM-yyyy');
    let fecha = currentDate.toString();
    const encryptedParam1 = CryptoJS.AES.encrypt(param1, fecha).toString();
    let parm1 = encryptedParam1.replace(/=/g, 'igual');
    parm1 = parm1.replace(/\//g, 'usco');
    const encryptedParam2 = CryptoJS.AES.encrypt(param2, fecha).toString();
    let parm2 = encryptedParam2.replace(/=/g, 'igual');
    parm2 = parm2.replace(/\//g, 'usco');

    // Concatenar los parámetros encriptados y retornarlos
    return parm1 + ',' + parm2;
  }

  decryptParams(encryptedParams: string): { param1: string, param2: string } {
    const currentDate: any = this.datePipe.transform(new Date(), 'dd-MM-yyyy');
    let fecha = currentDate.toString();
    const [encryptedParam1, encryptedParam2] = encryptedParams.split(',');
    const decryptedParam1 = CryptoJS.AES.decrypt(encryptedParam1, fecha).toString(CryptoJS.enc.Utf8);
    const decryptedParam2 = CryptoJS.AES.decrypt(encryptedParam2, fecha).toString(CryptoJS.enc.Utf8);
    return { param1: decryptedParam1, param2: decryptedParam2 };
  }

  scrollToSection(page: HTMLElement) {
    page.scrollIntoView({ behavior: 'smooth' });
  }

  buscarFirmaActiva() {
    this.firmaService.obtenerFirmaActiva().subscribe(data => {
      if (JSON.stringify(data) !== '[]') {
        this.rector = data;
        this.obtenerFirma(+data[0].ruta);
      }
    });
  }

  obtenerFirma(ruta: number) {
    this.firmaService.mirarFirma(ruta).subscribe(data => {
      var blob = new Blob([data], { type: 'image/png' });
      const foto = blob;
      const reader = new FileReader();
      reader.onload = () => {
        this.firma.url = reader.result as string;
      }
      reader.readAsDataURL(foto);
    });
  }

  buscarPoliticaEstamento() {
    this.politicaService.obtenerPoliticaPorCodigoEstamento(3).subscribe(data => {
      this.politicaDocente = data;
    });
  }

  mostrarFoto(perCodigo: String) {
    this.fotoService.mirarFoto(perCodigo).subscribe(data => {
      var gg = new Blob([data], { type: 'application/json' })
      if (gg.size !== 4) {
        var blob = new Blob([data], { type: 'image/png' });
        const foto = blob;
        const reader = new FileReader();
        reader.onload = () => {
          this.foto.url = reader.result as string;
        }
        reader.readAsDataURL(foto)

      } else {
        this.fotoService.mirarFotoAntigua('' + this.docente[0].persona.codigo).subscribe(data => {
          this.foto = data;
        });
      }
    });
  }

  mensajeRealizado() {
    Swal.fire({

      icon: 'success',
      title: 'Proceso Realizado',
      showConfirmButton: false,
      timer: 1500
    })
  }

  mensajeError() {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Ocurrio Un Error!',
    })

  }

  fError(er: any): void {

    let err = er.error.error_description;
    let arr: string[] = err.split(":");
    this.mensajeError()
    if (arr[0] == "Access token expired") {

      this.auth.logout();
      this.router.navigate(['login']);

    } else {
      this.mensajeError();
    }

  }
}