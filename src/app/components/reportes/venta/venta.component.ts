import { ReporteVenta } from 'src/app/models/reporte-venta';
import { ReportesService } from './../../../services/reportes.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-venta',
  templateUrl: './venta.component.html',
  styleUrls: ['./venta.component.css'],
})
export class VentaComponent implements OnInit {
  dataSource = new MatTableDataSource<ReporteVenta>([]);

  displayedColumns: string[] = [
    'codigo',
    'sede',
    'servicio',
    'fecha',
    'hora',
    'editar',
  ];

  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;

  constructor(public reportesService: ReportesService) {}

  ngOnInit(): void {
    this.obtenerVentas();
  }

  filtrar(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  obtenerVentas() {
    this.reportesService.obtenerReporteVentas().subscribe((data) => {
      console.log(data);
      this.dataSource = new MatTableDataSource<ReporteVenta>(data);
      this.paginator.firstPage();
      this.dataSource.paginator = this.paginator;
    });
  }
}
