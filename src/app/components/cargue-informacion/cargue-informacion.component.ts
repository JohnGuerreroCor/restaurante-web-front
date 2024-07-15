import { Component } from '@angular/core';
import { Contrato } from 'src/app/models/contrato';
import { TipoServicio } from 'src/app/models/tipoServicio';
import { AuthService } from 'src/app/services/auth.service';
import { ConsumoService } from 'src/app/services/consumo.service';
import { ContratoService } from 'src/app/services/contrato.service';
import { VentaService } from 'src/app/services/venta.service';
import { Venta } from 'src/app/models/venta';
import { Consumo } from 'src/app/models/consumo';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';


@Component({
  selector: 'app-cargue-informacion',
  templateUrl: './cargue-informacion.component.html',
  styleUrls: ['./cargue-informacion.component.css']
})
export class CargueInformacionComponent {

  nameFileVenta: string = 'Cargar Excel';
  nameFileConsumo: string = 'Cargar Excel';
  contratoVigente: Contrato = new Contrato();
  isContratoVigente: boolean = false;
  loading: boolean = false;
  currentDate: Date = new Date();
  uaa: number = this.authservice.user.uaaCodigo;
  excelVenta: any = null;
  excelConsumo: any = null;
  /*   tipoServicioSeleccionado: TipoServicio = { codigo: 0, nombre: 'Desayuno', estado: 1 }; */
  tiposServicio: TipoServicio[] = [
    { codigo: 1, nombre: 'Desayuno', estado: 1 },
    { codigo: 2, nombre: 'Almuerzo', estado: 1 },
    { codigo: 3, nombre: 'Cena', estado: 1 },
  ];
  tipoServicioSeleccionadoVenta: TipoServicio = { codigo: 0, nombre: '---', estado: 1 };
  tipoServicioSeleccionadoConsumo: TipoServicio = { codigo: 0, nombre: '---', estado: 1 };


  constructor(private contratoService: ContratoService,
    private authservice: AuthService,
    private ventaService: VentaService,
    private consumoService: ConsumoService) {
    this.contratoService.obtenerContratoByVigencia().subscribe((data: any) => {
      console.log(data);
      if (data.length <= 0) {
        this.isContratoVigente = false;
        return;
      } else {
        this.isContratoVigente = true;
        console.log(data[0].tipoContrato.nombre);
        console.log(data[0].fechaInicial);
        console.log(data[0].fechaFinal);
        this.contratoVigente = data[0];
      }
    });
  }

  ngOnInit() {
    this.currentDate = new Date();
  }

  async subirVentas(tipoCargue: number) {

    let ventas: Venta[] = [];

    ventas = await this.listarExcel(this.excelVenta, tipoCargue);

    if (ventas.length <= 0) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se puedieron leer los registros apropiadamente, verifique el excel y vuelva a intentarlo.'
      })
      return;
    }

    // Muestra el modal con un spinner
    Swal.fire({
      title: 'Cargando ventas',
      html: 'Espere por favor...',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    // Realiza la llamada al servicio
    this.ventaService.cargueVentas(ventas).subscribe((data: any) => {
      console.log("registros con error");
      console.log(data);

      const errorCount = data.length;

      let erroresHTML = '';
      data.forEach((error: any) => {
        erroresHTML += `<li> ${error} </li>`;
      });

      Swal.fire({
        icon: 'info',
        title: 'Informe cargue de ventas',
        html: `
              Total de registros insertados: <i class="fa-solid fa-check" style="color: #287233;"></i> ${ventas.length - errorCount}<br>
              Total de registros con error: <i class="fa-solid fa-xmark" style="color: #FF0000;"></i> ${errorCount}<br>
              <ul style="height:100px; width:100%; list-style: none; overflow:hidden; overflow-y:scroll; color: #FF0000; margin-top:2rem;">
                  ${erroresHTML}
              </ul>
          `,
        allowOutsideClick: true  // Permite cerrar el modal haciendo clic fuera de él
      });
    });

  }

  async subirConsumos(tipoCargue: number) {

    let consumos: Consumo[] = [];

    const result = await this.listarExcel(this.excelConsumo, tipoCargue);

    consumos = result as Consumo[];

    if (consumos.length <= 0) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se puedieron leer los registros apropiadamente, verifique el excel y vuelva a intentarlo.'
      })
      return;
    }

    // Muestra el modal con un spinner
    Swal.fire({
      title: 'Cargando consumos',
      html: 'Espere por favor...',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    // Realiza la llamada al servicio
    this.consumoService.cargueConsumos(consumos).subscribe((data: any) => {
      console.log("registros con error");
      console.log(data);

      const errorCount = data.length;

      let erroresHTML = '';
      data.forEach((error: any) => {
        erroresHTML += `<li> ${error} </li>`;
      });

      Swal.fire({
        icon: 'info',
        title: 'Informe cargue de consumos',
        html: `
              Total de registros insertados: <i class="fa-solid fa-check" style="color: #287233;"></i> ${consumos.length - errorCount}<br>
              Total de registros con error: <i class="fa-solid fa-xmark" style="color: #FF0000;"></i> ${errorCount}<br>
              <ul style="height:100px; width:100%; list-style: none; overflow:hidden; overflow-y:scroll; color: #FF0000; margin-top:2rem;">
                  ${erroresHTML}
              </ul>
          `,
        allowOutsideClick: true  // Permite cerrar el modal haciendo clic fuera de él
      });
    });

  }

  cargarExcel(event: any, tipoCargue: number) {
    if (tipoCargue === 1) {
      if (event.target.files[0] !== undefined) {
        this.excelVenta = event.target.files[0];
        this.nameFileVenta = this.excelVenta.name;
      }
    } else if (tipoCargue === 2) {
      if (event.target.files[0] !== undefined) {
        this.excelConsumo = event.target.files[0];
        this.nameFileConsumo = this.excelConsumo.name;
      }
    }
  }

  listarExcel(files: any, tipoCargue: number): Promise<Venta[] | Consumo[]> {
    return new Promise((resolve, reject) => {
      const file = files;
      const reader: FileReader = new FileReader();
      reader.onload = (e: any) => {
        const data = e.target.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0]; // Suponiendo que solo hay una hoja en el archivo
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 }); // Convertir hoja a JSON

        const registros: string[] = [];
        const ventas: Venta[] = [];
        const consumos: Consumo[] = [];

        // Procesar los datos
        // Iterar sobre las filas del archivo Excel, comenzando desde la segunda fila (índice 1)
        for (let rowIndex = 1; rowIndex < jsonData.length; rowIndex++) {
          const row: any = jsonData[rowIndex]; // Obtener la fila actual

          // Iterar sobre las celdas de la fila actual
          for (let columnIndex = 0; columnIndex < row.length; columnIndex++) {
            const cell = row[columnIndex];
            console.log(cell); // Aquí puedes hacer lo que necesites con cada celda
            registros.push(cell);

            if (tipoCargue == 1) {
              const venta: Venta = {
                codigo: "",
                persona: { codigo: 0, tipoDocumento: 0, documento: "", identificacion: cell, grupoSanguineo: "", genero: "", fechaExpedicionDocumento: new Date(), fechaNacimiento: new Date(), edad: 0, nombre: "", apellido: "", emailPersonal: "", emailInterno: "" },
                tipoServicio: { codigo: this.tipoServicioSeleccionadoVenta.codigo, nombre: "", estado: 1 },
                contrato: { codigo: this.contratoVigente.codigo, tipoContrato: { codigo: 0, nombre: "", descripcion: "", estado: 1 }, fechaInicial: "", fechaFinal: "", valorContrato: 0, subsidioDesayuno: 0, subsidioAlmuerzo: 0, subsidioCena: 0, pagoEstudianteDesayuno: 0, pagoEstudianteAlmuerzo: 0, pagoEstudianteCena: 0, cantidadDesayunos: 0, cantidadAlmuerzos: 0, cantidadCenas: 0, dependencia: { codigo: 0, sedeNombre: "", municipioCodigo: 0, sedeNombreCorto: "" }, estado: 1, isEditing: false },
                dependencia: { codigo: this.uaa, sedeNombre: "", municipioCodigo: 0, sedeNombreCorto: "" },
                estado: 1,
                fecha: this.currentDate.toISOString().slice(0, 10),
                hora: this.currentDate.toLocaleDateString('es-CO', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }).slice(11, 19)
              };
              ventas.push(venta);
            } else if (tipoCargue == 2) {
              const consumo: Consumo = {
                codigo: "",
                persona: { codigo: 0, tipoDocumento: 0, documento: "", identificacion: cell, grupoSanguineo: "", genero: "", fechaExpedicionDocumento: new Date(), fechaNacimiento: new Date(), edad: 0, nombre: "", apellido: "", emailPersonal: "", emailInterno: "" },
                venta: {
                  codigo: "", persona: { codigo: 0, tipoDocumento: 0, documento: "", identificacion: "", grupoSanguineo: "", genero: "", fechaExpedicionDocumento: new Date(), fechaNacimiento: new Date(), edad: 0, nombre: "", apellido: "", emailPersonal: "", emailInterno: "" },
                  tipoServicio: { codigo: this.tipoServicioSeleccionadoConsumo.codigo, nombre: "", estado: 1 },
                  contrato: { codigo: this.contratoVigente.codigo, tipoContrato: { codigo: 0, nombre: "", descripcion: "", estado: 1 }, fechaInicial: "", fechaFinal: "", valorContrato: 0, subsidioDesayuno: 0, subsidioAlmuerzo: 0, subsidioCena: 0, pagoEstudianteDesayuno: 0, pagoEstudianteAlmuerzo: 0, pagoEstudianteCena: 0, cantidadDesayunos: 0, cantidadAlmuerzos: 0, cantidadCenas: 0, dependencia: { codigo: 0, sedeNombre: "", municipioCodigo: 0, sedeNombreCorto: "" }, estado: 1, isEditing: false },
                  dependencia: { codigo: 0, sedeNombre: "", municipioCodigo: 0, sedeNombreCorto: "" },
                  estado: 1,
                  fecha: this.currentDate.toISOString().slice(0, 10),
                  hora: this.currentDate.toLocaleDateString('es-CO', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }).slice(11, 19)
                },
                tipoServicio: { codigo: this.tipoServicioSeleccionadoConsumo.codigo, nombre: "", estado: 1 },
                contrato: { codigo: this.contratoVigente.codigo, tipoContrato: { codigo: 0, nombre: "", descripcion: "", estado: 1 }, fechaInicial: "", fechaFinal: "", valorContrato: 0, subsidioDesayuno: 0, subsidioAlmuerzo: 0, subsidioCena: 0, pagoEstudianteDesayuno: 0, pagoEstudianteAlmuerzo: 0, pagoEstudianteCena: 0, cantidadDesayunos: 0, cantidadAlmuerzos: 0, cantidadCenas: 0, dependencia: { codigo: 0, sedeNombre: "", municipioCodigo: 0, sedeNombreCorto: "" }, estado: 1, isEditing: false },
                dependencia: { codigo: this.uaa, sedeNombre: "", municipioCodigo: 0, sedeNombreCorto: "" },
                estado: 1,
                fecha: this.currentDate.toISOString().slice(0, 10),
                hora: this.currentDate.toLocaleDateString('es-CO', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }).slice(11, 19)
              };
              consumos.push(consumo);
            }
          }
        }

        if (tipoCargue === 1) {
          console.log("ventas");
          console.log(ventas);
          resolve(ventas);
        } else if (tipoCargue === 2) {
          console.log("consumos");
          console.log(consumos);
          resolve(consumos);
        }
      };
      reader.readAsBinaryString(file);
    });
  }

}
