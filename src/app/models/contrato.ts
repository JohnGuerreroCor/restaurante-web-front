import { Sede } from "./sede";
import { TipoContrato } from "./tipo-contrato";

export class Contrato {
    codigo!: number;
    tipoContrato!: TipoContrato;
    fechaInicial!: string;
    fechaFinal!: string;
    valorContrato!: number;
    subsidioDesayuno!: number;
    subsidioAlmuerzo!: number;
    subsidioCena!: number;
    pagoEstudianteDesayuno!: number;
    pagoEstudianteAlmuerzo!: number;
    pagoEstudianteCena!: number;
    cantidadDesayunos!: number;
    cantidadAlmuerzos!: number;
    cantidadCenas!: number;
    dependencia!: Sede;
    estado!: number;
    isEditing!: boolean;
}