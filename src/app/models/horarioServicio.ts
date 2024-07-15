import { Sede } from "./sede";
import { Dia } from "./dia";
import { TipoServicio } from "./tipoServicio";

export class HorarioServicio {
    codigo!: number;
    horaIncioVenta!: string;
    horaFinVenta!: string;
    horaInicioAtencion!: string;
    horaFinAtencion!: string;
    tipoServicio!: TipoServicio;
    uaa!: Sede;
    estado!: number;
    observacionEstado!: string;
    fechaEstado!: string;
    cantidadComidas!: number;
    cantidadVentasPermitidas!: number;
    cantidadTiquetes!: number;
}