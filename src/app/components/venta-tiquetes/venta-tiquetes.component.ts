import { Component, ElementRef, NgZone, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Contrato } from 'src/app/models/contrato';
import { Estudiante } from 'src/app/models/estudiante';
import { HorarioServicio } from 'src/app/models/horarioServicio';
import { Sede } from 'src/app/models/sede';
import { TipoServicio } from 'src/app/models/tipoServicio';
import { Venta } from 'src/app/models/venta';
import { TablaVenta } from 'src/app/models/tabla-venta';
import { AuthService } from 'src/app/services/auth.service';
import { ContratoService } from 'src/app/services/contrato.service';
import { EstudianteService } from 'src/app/services/estudiante.service';
import { HorarioServicioService } from 'src/app/services/horario-servicio.service';
import { VentaService } from 'src/app/services/venta.service';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatSort, Sort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import swal from 'sweetalert2'
import Swal from 'sweetalert2';
import { FotoService } from 'src/app/services/foto.service';
import { GrupoGabuService } from 'src/app/services/grupo-gabu.service';
import { GrupoGabu } from 'src/app/models/grupoGabu';
import { DiaBeneficioService } from 'src/app/services/dia-beneficio.service';
import { DiaBeneficio } from 'src/app/models/diaBeneficio';

const ELEMENT_DATA: TablaVenta[] = [
  /*  { codigo: '1', fecha: '2021-10-12', hora: '10:00:00' }, */
];

@Component({
  selector: 'app-venta-tiquetes',
  templateUrl: './venta-tiquetes.component.html',
  styleUrls: ['./venta-tiquetes.component.css']
})
export class VentaTiquetesComponent {

  dataSource = new MatTableDataSource(ELEMENT_DATA);
  displayedColumns: string[] = ['codigo', 'fecha', 'hora', 'tipoServicio', 'acciones'];

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild('codigoInput', { static: false }) codigoInput!: ElementRef;

  horaFecha!: Date;
  tipoServicio = new TipoServicio();
  radioTipoServicio: string = "1";
  codigo = '';
  sede: Sede = {
    codigo: this.authservice.user.uaaCodigo,
    sedeNombre: '',
    municipioCodigo: 0,
    sedeNombreCorto: '',
  };
  estudiante: Estudiante = new Estudiante();
  contratoVigente: Contrato = new Contrato();
  isContratoVigente: boolean = false;
  isVentaActiva = false;
  isTiquetesDisponibles = false;
  ventasTiempoReal = 0;
  limiteTiquetesVenta = 0;
  userLogeado: String = this.authservice.user.username;
  tiquetesComprados: number[] = [0, 0, 0];
  numeroRacionesVender: number | null = 1;
  horarioServicio: HorarioServicio[] = [];
  isValidated = false;
  imagenURL: string = "https://www.usco.edu.co/imagen-institucional/logo/precarga-usco.gif";
  isGabu: boolean = false;
  gabusVendidos: number = 0;
  tiposServicioGratisGabus = [0, 0, 0];

  constructor(private ventaService: VentaService,
    private estudianteService: EstudianteService,
    private horarioServicioService: HorarioServicioService,
    private contratoService: ContratoService,
    private authservice: AuthService,
    private _liveAnnouncer: LiveAnnouncer,
    private ngZone: NgZone,
    private fotoService: FotoService,
    private grupoGabuService: GrupoGabuService,
    private diaBeneficioService: DiaBeneficioService,
    ) {
    this.estudiante.codigo = '';
    this.estudiante.codigoPrograma = 0;
    this.estudiante.fechaIngreso = new Date();
    this.estudiante.codigoInscripcion = 0;
    this.estudiante.estadoEgresado = 0;
    this.estudiante.persona = {} as any;
    this.estudiante.programa = {} as any;
    ELEMENT_DATA.length = 0;
  }

  ngOnInit(): void {
   
      this.ngZone.run(() => {
        
          this.horaFecha = new Date();
        
        if (!this.isValidated && this.horaFecha != undefined) {
          this.isValidated = true;
          this.validarHorarioServicio();
        }
      });
    

  }


  eliminarVenta(element: any) {

    Swal.fire({
      title: "Seguro?",
      text: "No podras restablecer una vez borrado el registro!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, borrar!"
    }).then((result) => {
      if (result.isConfirmed) {

        const venta = new Venta();
        venta.codigo = element.codigo;
        venta.estado = 0;
        venta.eliminado = 0;

        this.ventaService.eliminarVenta(venta).subscribe(
          venta => {

            if (venta != 0) {
              this.obtenerVentasEstudiante();
              this.verificarTiquetesDisponibles();
              Swal.fire({
                title: "Borrado!",
                text: "El registro fue borrado existosamente.",
                icon: "success"
              });
            } else {
              Swal.fire({
                title: "Oops...",
                text: "No se pudo borrar el registro!",
                icon: "error"
              });
            }
          }
        );
      }
    });
  }

  obtenerVentasEstudiante() {

    this.ventaService.obtenerVentasByPerCodigo(this.estudiante.persona.codigo, this.contratoVigente.codigo).subscribe(
      venta => {

        ELEMENT_DATA.length = 0;
        this.tiquetesComprados = [0, 0, 0];

        venta.forEach(element => {

          if (element.tipoServicio.codigo == 1) {
            this.tiquetesComprados[0] += 1;
          }
          if (element.tipoServicio.codigo == 2) {
            this.tiquetesComprados[1] += 1;
          }
          if (element.tipoServicio.codigo == 3) {
            this.tiquetesComprados[2] += 1;
          }
        });

        venta.forEach(element => {
          let venta = new TablaVenta();
          venta.codigo = element.codigo;
          venta.fecha = element.fecha;
          venta.hora = element.hora;
          venta.nombreTipoServicio = element.tipoServicio.nombre;
          ELEMENT_DATA.push(venta);
        });

        this.dataSource = new MatTableDataSource(ELEMENT_DATA);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
    );
  }

  registrarVenta() {

    try {

      if (this.estudiante.codigo == "") {
        swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Busque un código o ID de estudiante primero!',
        });
        return;
      }

      if (this.numeroRacionesVender != null) {

        const numeroRacionesVenderString: string = String(Math.max(0, parseInt(String(this.numeroRacionesVender)))).slice(0, 4);

        const numeroRacionesVender: number = parseFloat(numeroRacionesVenderString);
        this.numeroRacionesVender = numeroRacionesVender;

        if (!Number.isInteger(this.numeroRacionesVender)) {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Ingrese un número válido!',
          });
          this.numeroRacionesVender = null;
          return;
        }

        let ventas: Venta[] = [];

        for (let i = 0; i < this.numeroRacionesVender; i++) {

          let venta = new Venta();
          venta.codigo = '';
          venta.persona = this.estudiante.persona;
          venta.tipoServicio = { codigo: parseInt(this.radioTipoServicio), nombre: '', estado: 1 } as TipoServicio;
          venta.contrato = this.contratoVigente;
          venta.dependencia = this.sede;
          venta.estado = 1;
          venta.fecha = new Date().toISOString().slice(0, 10);
          venta.hora = new Date().toLocaleDateString('es-CO', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }).slice(11, 19);
          venta.eliminado = 1


          if (venta.tipoServicio.codigo == 1 && this.tiquetesComprados[0] + parseInt(this.numeroRacionesVender.toString()) > this.horarioServicio[0].cantidadTiquetes) {

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
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'No hay tiquetes disponibles para el servicio de desayuno',
            });
            break;
          }

          if (venta.tipoServicio.codigo == 2 && this.tiquetesComprados[1] + parseInt(this.numeroRacionesVender.toString()) > this.horarioServicio[1].cantidadTiquetes) {
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

            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'No hay tiquetes disponibles para el servicio de almuerzo'
            });
            break;
          }

          if (venta.tipoServicio.codigo == 3 && this.tiquetesComprados[2] + parseInt(this.numeroRacionesVender.toString()) > this.horarioServicio[2].cantidadTiquetes) {
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
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'No hay tiquetes disponibles para el servicio de cena',
            });
            break;
          }

          ventas.push(venta);

        }

        console.log("ventas");
        console.log(ventas);


        this.ventaService.registrarVentas(ventas).subscribe(
          venta => {

            if (venta === 0) {
              Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'No se pudo realizar la venta!',
              });

            } else {

              const Toast = swal.mixin({
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 1000,
                timerProgressBar: true,
                didOpen: (toast) => {
                  toast.addEventListener('mouseenter', swal.stopTimer)
                  toast.addEventListener('mouseleave', swal.resumeTimer)
                }
              });

              Toast.fire({
                icon: 'success',
                title: 'Excelente!',
                text: "Venta realizada existosamente."
              });

              this.obtenerVentasEstudiante();
              this.focusInput();
              this.verificarTiquetesDisponibles();
            }
          }
        );
      }

    } catch (error) {
      console.log(error);
    }

  }

  verificarTiquetesDisponibles() {
    this.ventaService.obtenerVentasDiariasOrdinarias(this.tipoServicio.codigo, this.contratoVigente.codigo).subscribe(
      cantidad => {
        this.ventasTiempoReal = cantidad;
        var limiteTiquetes = this.horarioServicio.find(objeto => objeto.tipoServicio.codigo == this.tipoServicio.codigo)?.cantidadVentasPermitidas;
        this.limiteTiquetesVenta = limiteTiquetes || 0;

        if (limiteTiquetes !== undefined && cantidad < limiteTiquetes) {
          this.isTiquetesDisponibles = true;
        } else {
          this.isTiquetesDisponibles = false;
        }
      }
    );

    this.ventaService.obtenerVentasDiariasGabus(this.tipoServicio.codigo, this.contratoVigente.codigo).subscribe(
      cantidad => {
        this.gabusVendidos = cantidad;

      }
    )
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



  buscarEstudiante() {

    this.isGabu = false;
    this.tiposServicioGratisGabus = [0, 0, 0];

    if (this.codigo === '' || this.codigo === null || this.codigo === undefined) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Campo codigo vacío!',
      });
    } else {
      this.estudianteService.getEstudiante(this.codigo).subscribe(
        persona => {

          if (persona.length > 0) {
            this.estudiante = persona[0];
            this.validarPerteneceGrupoGabu(persona[0].persona.codigo);
            this.cargarFoto(persona);
            this.obtenerVentasEstudiante();
            this.codigo = '';
          } else {
            this.estudianteService.buscarEstudianteIdentifiacion(this.codigo).subscribe(
              persona => {
                if (persona.length > 0) {
                  this.estudiante = persona[0];
                  this.cargarFoto(persona);
                  this.obtenerVentasEstudiante();
                  this.codigo = '';
                } else {
                  Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'No se encontró el estudiante!',
                  });
                }
              }
            );
          }
        }
      );
    }
  }

  validarHorarioServicio() {
    this.horarioServicioService.obtenerHorariosServicio().subscribe(
      horarioServicio => {
        if (horarioServicio.length > 0) {
          this.validarModuloVentaActivo(horarioServicio);
        }
      }

    );
  }

  validarModuloVentaActivo(horarioServicio: HorarioServicio[]) {

    this.horarioServicio = horarioServicio;

    var objetoEncontrado = horarioServicio.find((objeto) => {


      var horaInicioVenta = new Date('1970-01-01T' + objeto.horaIncioVenta);
      var horaFinVenta = new Date('1970-01-01T' + objeto.horaFinVenta);
      var horaActual = new Date(this.horaFecha);

      // Extraer solo la hora de los objetos Date
      var horaInicioVentaSoloHora = horaInicioVenta.getHours() * 3600 + horaInicioVenta.getMinutes() * 60 + horaInicioVenta.getSeconds();
      var horaFinVentaSoloHora = horaFinVenta.getHours() * 3600 + horaFinVenta.getMinutes() * 60 + horaFinVenta.getSeconds();
      var horaActualSoloHora = horaActual.getHours() * 3600 + horaActual.getMinutes() * 60 + horaActual.getSeconds();

      return objeto.uaa.codigo == this.sede.codigo && horaActualSoloHora >= horaInicioVentaSoloHora && horaActualSoloHora <= horaFinVentaSoloHora && objeto.estado == 1;
    });

    if (objetoEncontrado != null && objetoEncontrado != undefined) {
      this.isVentaActiva = true;
      this.tipoServicio = objetoEncontrado.tipoServicio;
      this.radioTipoServicio = objetoEncontrado.tipoServicio.codigo.toString();
      this.validarContratoVigente();
    }
  }

  validarPerteneceGrupoGabu(codigo: number) {
    this.grupoGabuService.obtenerGabu(codigo).subscribe(
      (response: GrupoGabu[]) => {
        if (response.length > 0) {
          this.isGabu = true;
          this.obtenerDiasBeneficioGabu(response[0].codigo);
        } else {
          this.isGabu = false;
        }
      }
    );
  }

  obtenerDiasBeneficioGabu(codigoGabu: number) {
    this.diaBeneficioService.obtenerDiasBeneficio(codigoGabu).subscribe(
      (response: DiaBeneficio[]) => {

        if (response.length > 0) {

          let diaSemana = this.horaFecha.getDay();

          // como domingo es 0, se cambia a 7
          let diaNumerico: number;
          if (diaSemana === 0) {
            diaNumerico = 7; // Domingo es el día 7 en este formato
          } else {
            diaNumerico = diaSemana;
          }

          for (let index = 1; index < 4; index++) {

            const objetoBuscado = response.find(objeto => {
              return objeto.tipoServicio.codigo === index && objeto.dia.codigo === diaNumerico && objeto.estado === 1;
            });


            if (objetoBuscado != null && objetoBuscado != undefined) {
              this.tiposServicioGratisGabus[index - 1] = objetoBuscado.tipoServicio.codigo;
            } else {
              this.tiposServicioGratisGabus[index - 1] = 0;
            }

          }

        } else {
          this.tiposServicioGratisGabus = [0, 0, 0];
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

  find(codigo: string) {
    console.log(codigo);
  }

  focusInput() {
    // Enfocar el input utilizando el elemento ElementRef
    if (this.codigoInput && this.codigoInput.nativeElement) {
      this.codigoInput.nativeElement.focus();
    }
  }

  announceSortChange(sortState: Sort) {
    // This example uses English messages. If your application supports
    // multiple language, you would internationalize these strings.
    // Furthermore, you can customize the message to add additional
    // details about the values being sorted.
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}
