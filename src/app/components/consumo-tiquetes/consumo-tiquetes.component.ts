import { Component, HostListener, NgZone, ViewChild } from '@angular/core';
import { BehaviorSubject, timer } from 'rxjs';
import { BarcodeFormat } from '@zxing/library';
import { ConsumoService } from 'src/app/services/consumo.service';
import { Contrato } from 'src/app/models/contrato';
import { VentaService } from 'src/app/services/venta.service';
import { HoraServidorService } from 'src/app/services/hora-servidor.service';
import { ContratoService } from 'src/app/services/contrato.service';
import { EstudianteService } from 'src/app/services/estudiante.service';
import { Estudiante } from 'src/app/models/estudiante';
import { FotoService } from 'src/app/services/foto.service';
import swal from 'sweetalert2'
import { WebparametroService } from 'src/app/services/webparametro.service';
import Swal from 'sweetalert2';
import { PublickeyService } from 'src/app/services/publickey.service';
import { Sede } from 'src/app/models/sede';
import { TipoServicio } from 'src/app/models/tipoServicio';
import { HorarioServicio } from 'src/app/models/horarioServicio';
import { HorarioServicioService } from 'src/app/services/horario-servicio.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-consumo-tiquetes',
  templateUrl: './consumo-tiquetes.component.html',
  styleUrls: ['./consumo-tiquetes.component.css']
})
export class ConsumoTiquetesComponent {

  availableDevices!: MediaDeviceInfo[];
  currentDevice!: MediaDeviceInfo;
  tryHarder = false;
  hasDevices!: boolean;
  hasPermission!: boolean;
  torchAvailable$ = new BehaviorSubject<boolean>(false);
  horaFecha!: Date;
  contratoVigente: Contrato = new Contrato();
  isContratoVigente: boolean = false;
  consumosTiempoReal = 0;
  limiteConsumos = 0;
  codigo = '';
  imagenURL: string = "https://www.usco.edu.co/imagen-institucional/logo/precarga-usco.gif";
  estudiante: any = {
    nombre: "...",
    apellido: "...",
    codigo: 0,
    id: 0,
    programa: ""
  };
  sede: Sede = {
    codigo: this.authservice.user.uaaCodigo,
    sedeNombre: '',
    municipioCodigo: 0,
    sedeNombreCorto: '',
  };
  isConsumoActivo = false;
  isReadingAllowed: boolean = true;
  isValidated = false;
  isConsumosDisponibles = false;
  tipoServicio = new TipoServicio();
  horarioServicio: HorarioServicio[] = [];
  selectedDevice: MediaDeviceInfo | undefined;
  allowedFormats: BarcodeFormat[] = [BarcodeFormat.QR_CODE];
  videoInputDevices: MediaDeviceInfo[] = [];
  qrLeidoString: string = '';

  constructor(
    private consumoService: ConsumoService,
    private horaServidorService: HoraServidorService,
    private contratoService: ContratoService,
    private estudianteService: EstudianteService,
    private authservice: AuthService,
    private fotoService: FotoService,
    private webparametroService: WebparametroService,
    private publicKeyService: PublickeyService,
    private horarioServicioService: HorarioServicioService,
    private ngZone: NgZone,) {
  }

  ngOnInit(): void {
    this.horaServidorService.horaFechaObservable.subscribe((horaFecha: string) => {

      this.ngZone.run(() => {
        if (horaFecha !== 'No disponible') {
          this.horaFecha = new Date(horaFecha);
        }
        if (!this.isValidated && this.horaFecha != undefined) {
          this.isValidated = true;
          this.validarHorarioServicio();
        }
      });
    });
  }

  @HostListener('document:keypress', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {

    // Aquí puedes definir el carácter especial que indica el final de la lectura del código de barras
    const endCharacter = '\n'; // Por ejemplo, puede ser un retorno de carro o una combinación específica de teclas

    if (this.isReadingAllowed == false) {
      return;
    }

    let lectura: string = event.key;

    this.qrLeidoString += lectura;

    if (this.qrLeidoString.substring(this.qrLeidoString.length - 5) == 'Enter') {


      let qrLeidoString = this.qrLeidoString.split('Enter')[0];

      this.qrLeidoString = '';

      this.isReadingAllowed = false;

      console.log(qrLeidoString);

      this.consumoService.validarConsumo(qrLeidoString).subscribe(
        (response) => {
          this.respuestaConsumo(response);
          this.verificarTiquetesDisponibles();
        }
      );
      this.codigo = '';

      /* Swal.fire({
        title: 'Cargando...',
        html: 'Espere por favor...',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      }); */

      timer(2000).subscribe(() => {
        this.isReadingAllowed = true;

        /* Swal.fire({
          icon: 'success',
          title: 'Excelente!',
          text: 'lectura satisfactoria!',
          allowOutsideClick: true,
        }) */

      });
    }

  }

  validarHorarioServicio() {
    this.horarioServicioService.obtenerHorariosServicio().subscribe(
      horarioServicio => {
        if (horarioServicio.length > 0) {
          this.validarModuloConsumoActivo(horarioServicio);
        }
      }
    );
  }

  verificarTiquetesDisponibles() {
    this.consumoService.obtenerConsumosDiarios(this.tipoServicio.codigo, this.contratoVigente.codigo).subscribe(
      cantidad => {
        this.consumosTiempoReal = cantidad;
        var limiteConsumos = this.horarioServicio.find(objeto => objeto.tipoServicio.codigo == this.tipoServicio.codigo)?.cantidadComidas;
        this.limiteConsumos = limiteConsumos || 0;
        if (limiteConsumos !== undefined && cantidad < limiteConsumos) {
          this.isConsumosDisponibles = true;
        } else {
          this.isConsumosDisponibles = false;
        }
      }
    );
  }

  validarModuloConsumoActivo(horarioServicio: HorarioServicio[]) {

    this.horarioServicio = horarioServicio;

    var objetoEncontrado = horarioServicio.find((objeto) => {

      // Convertir las horas de los objetos a Date
      var horaInicioAtencion = new Date('1970-01-01T' + objeto.horaInicioAtencion);
      var horaFinAtencion = new Date('1970-01-01T' + objeto.horaFinAtencion);
      var horaActual = new Date(this.horaFecha);

      // Extraer solo la hora de los objetos Date
      var horaInicioAtencionSoloHora = horaInicioAtencion.getHours() * 3600 + horaInicioAtencion.getMinutes() * 60 + horaInicioAtencion.getSeconds();
      var horaFinAtencionSoloHora = horaFinAtencion.getHours() * 3600 + horaFinAtencion.getMinutes() * 60 + horaFinAtencion.getSeconds();
      var horaActualSoloHora = horaActual.getHours() * 3600 + horaActual.getMinutes() * 60 + horaActual.getSeconds();

      return objeto.uaa.codigo == this.sede.codigo && horaActualSoloHora >= horaInicioAtencionSoloHora && horaActualSoloHora <= horaFinAtencionSoloHora && objeto.estado == 1;
    });

    if (objetoEncontrado != null && objetoEncontrado != undefined) {
      this.isConsumoActivo = true;
      this.tipoServicio = objetoEncontrado.tipoServicio;
      this.validarContratoVigente();
    }
  }

  validarConsumo() {

    if (this.codigo == '' || this.codigo == null) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: "El campo no puede estar vacio!"
      });
      return;
    }

    this.estudianteService.getEstudiante(this.codigo).subscribe(
      estudiante => {

        if (estudiante.length > 0 && estudiante != null) {
          this.intentarConsumo(estudiante);
        } else {
          this.estudianteService.buscarEstudianteIdentifiacion(this.codigo).subscribe(
            persona => {

              if (persona.length > 0 && persona != null) {
                this.intentarConsumo(persona);
              } else {
                Swal.fire({
                  icon: 'error',
                  title: 'Oops...',
                  text: "Codigo incorrecto o no existe en la base de datos!"
                });
              }
            }
          );

        }
      }
    );

  }

  respuestaConsumo(response: number) {
    if (response == 0) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: "La persona ya consumió ó no tiene consumos disponibles",
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false,
      });
    }

    if (response == -1) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: "Error al crear el consumo :(",
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false,
      });
    }

    if (response == -2) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: "EL QR leido está vencido o es de caracter invalido!",
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false,
      });
    }

    if (response == -3) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: "EL contrato al que pertenece el tiquete expiró!",
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false,
      });
    }

    if (response > 0) {

      Swal.fire({
        icon: 'success',
        title: 'Excelente!',
        text: "Consumo satisfactorio!",
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false,
      });

      this.estudianteService.buscarEstudianteIdentifiacion(response).subscribe(
        persona => {
          if (persona.length > 0) {
            this.estudiante.nombre = persona[0].persona.nombre;
            this.estudiante.apellido = persona[0].persona.apellido;
            this.estudiante.codigo = persona[0].codigo;
            this.estudiante.id = persona[0].persona.identificacion;
            this.estudiante.programa = persona[0].programa.nombreCorto;

            this.cargarFoto(persona);

          }
        }
      );

    }
  }

  intentarConsumo(persona: Estudiante[]) {
    const mensajeEnviar = `${persona[0].persona.codigo}`;
    this.publicKeyService.encrpyt(mensajeEnviar).subscribe(
      (mensajeEncriptado) => {

        this.consumoService.validarConsumo(mensajeEncriptado).subscribe(
          (response) => {
            this.respuestaConsumo(response);
            this.verificarTiquetesDisponibles();
          }
        );
        this.codigo = '';
      }
    );
  }


  onScanSuccess(result: string) {

    if (this.isReadingAllowed == false) {
      return;
    }

    //reemplazamos los - que vienen de la lectura por + 
    let cadenaReemplazada: string = result.replace(/\-/g, "+");

    this.consumoService.validarConsumo(cadenaReemplazada).subscribe(
      (response) => {
        this.respuestaConsumo(response);
      }
    );

    this.isReadingAllowed = false;

    timer(2000).subscribe(() => {
      this.isReadingAllowed = true;
    });

  }

  onCamerasFound(devices: MediaDeviceInfo[]) {

    this.videoInputDevices = devices.filter(device => device.kind === 'videoinput');
    // Si tienes al menos una cámara, selecciona la primera por defecto
    if (this.videoInputDevices.length > 0) {
      this.selectedDevice = this.videoInputDevices[0];
    }
  }

  switchCamera() {
    if (this.selectedDevice != undefined) {
      if (this.videoInputDevices && this.videoInputDevices.length > 1) {
        // Encuentra el índice actual

        const currentIndex = this.videoInputDevices.indexOf(this.selectedDevice);

        // Cambia al siguiente dispositivo de cámara
        this.selectedDevice = this.videoInputDevices[(currentIndex + 1) % this.videoInputDevices.length];
      } else {
        console.warn('No hay suficientes cámaras disponibles para cambiar.');
      }
    }
  }


  leerQR() {
    console.log('Leer QR');
  }

  efectuarConsumo() {

    console.log("Efectuando consumo");


    //debo obtener las ventas del estudiante y segun tipo eliminar la mas antigua 
    /* this.ventaService.obtenerVentasByPerCodigo(144065, 31).subscribe(
      (ventas) => {
        console.log(ventas);

        // Verificar si hay ventas
        if (ventas && ventas.length > 0) {
          // Ordenar las ventas por fecha de forma ascendente (la más antigua primero)
          ventas.sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());

          // Obtener la venta más antigua
          const ventaMasAntigua = ventas[0];
          console.log('Venta más antigua:', ventaMasAntigua);
        } else {
          alert('El individuo no tiene tiquetes disponibles para consumir!');
        }
      }
    ); */

    //registrar consumos
    /* let consumo: Consumo = new Consumo();
    consumo.persona = {
      codigo: 144065,
    } as any;
    consumo.venta = {
      codigo: 31,
    } as any;
    consumo.tipoServicio = {
      codigo: 1,
    } as any;
    consumo.contrato = {
      codigo: 31,
    } as any;
    consumo.dependencia = {
      codigo: 645,
    } as any;
    consumo.estado = 1;
    consumo.fecha = '2021-06-20';
    consumo.hora = '10:00:00';

    this.consumoService.registrarConsumo(consumo).subscribe(
      (codigo: number) => {
        console.log(codigo);
      }
    ); */

  }

  buscarEstudiante() {
    this.estudianteService.getEstudiante(this.codigo).subscribe(
      persona => {
        if (persona.length > 0) {
          this.estudiante = persona[0];
          this.efectuarConsumo();
        }
      }
    );
  }

  cargarFoto(persona: Estudiante[]) {
    this.fotoService.mirarFoto(persona[0].persona.codigo.toString()).subscribe(
      data => {
        var gg = new Blob([data], { type: 'application/json' })
        if (gg.size !== 4) {
          var blob = new Blob([data], { type: 'image/png' });
          const foto = blob;
          const reader = new FileReader();
          reader.onload = () => {
            this.imagenURL = reader.result as string;
          }
          reader.readAsDataURL(foto)

        } else {
          this.fotoService.mirarFotoAntigua(persona[0].persona.codigo.toString()).subscribe(data => {
            this.imagenURL = data.url.toString();
          });
        }
      }
    );
  }

  validarContratoVigente() {
    this.contratoService.obtenerContratoByVigencia().subscribe(
      contrato => {
        if (contrato.length > 0) {
          this.contratoVigente = contrato[0];
          this.isContratoVigente = true;
          this.verificarTiquetesDisponibles();
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'No hay contrato vigente!',
          });
          this.isContratoVigente = false;
        }
      }
    );
  }

  consultarSemilla() {
    this.webparametroService.obtenerSemilla().subscribe(data => {
    });
  }
}
