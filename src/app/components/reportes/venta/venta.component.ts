import { Component, OnInit, ViewChild } from '@angular/core';
import { ReporteVentaExcelService } from 'src/app/services/reporte-venta-excel.service';
import { ReportesService } from 'src/app/services/reportes.service';
import { ReporteVenta } from 'src/app/models/reporte-venta';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-venta',
  templateUrl: './venta.component.html',
  styleUrls: ['./venta.component.css'],
})
export class VentaComponent implements OnInit {
  fechaInicio!: Date;
  fechaFin!: Date;
  dataForExcel: any[] = [];
  dataVenta: any[] = [];
  listadoVenta: ReporteVenta[] = [];

  noInformacion: boolean = false;
  precarga: boolean = true;

  dataSource = new MatTableDataSource<ReporteVenta>([]);

  displayedColumns: string[] = [
    'codigo',
    'id',
    'nombre',
    'gabu',
    'sede',
    'servicio',
    'fecha',
    'estado',
  ];

  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;

  constructor(
    public reportesService: ReportesService,
    public reporteVentaExcelService: ReporteVentaExcelService,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {}

  filtrar(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  obtenerVentas() {
    this.listadoVenta = [];
    let inicio = this.datePipe.transform(this.fechaInicio, 'yyyy-MM-dd');
    let fin = this.datePipe.transform(this.fechaFin, 'yyyy-MM-dd');
    this.reportesService.obtenerReporteVentas(inicio, fin).subscribe((data) => {
      this.listadoVenta = data;
      this.dataSource = new MatTableDataSource<ReporteVenta>(data);
      this.paginator.firstPage();
      this.dataSource.paginator = this.paginator;
      this.crearDatasource();
    });
  }

  crearDatasource() {
    this.dataVenta = [];
    for (let index = 0; index < this.listadoVenta.length; index++) {
      let fecha = this.datePipe.transform(
        this.listadoVenta[index].fecha,
        'dd-MM-yyyy'
      );
      let condicion: string;
      if (this.listadoVenta[index].estado == 1) {
        condicion = 'NO';
      } else {
        condicion = 'SI';
      }
      this.dataVenta.push({
        N: index + 1,
        NOMBRE: this.listadoVenta[index].personaNombre,
        IDENTIFICACION: this.listadoVenta[index].personaIdentificacion,
        GABU: this.listadoVenta[index].gabu,
        SEDE: this.listadoVenta[index].sedeNombre,
        SERVICIO: this.listadoVenta[index].tipoServicioNombre,
        FECHA: fecha,
        HORA: this.listadoVenta[index].hora,
        CANJEADO: condicion,
      });
    }
  }

  reporteVentaExcel() {
    this.dataVenta.forEach((row: any) => {
      this.dataForExcel.push(Object.values(row));
    });
    let fecha = this.datePipe.transform(Date.now(), 'dd-MM-yyyy h:mm a');
    let reportData = {
      title: 'Reporte Ventas Realizadas - ' + fecha,
      data: this.dataForExcel,
      headers: Object.keys(this.dataVenta[0]),
    };

    this.reporteVentaExcelService.exportExcel(reportData);
  }
}
