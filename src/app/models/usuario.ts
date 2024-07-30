export class Usuario {
  id!: number;
  username!: string;
  password!: string;
  personaCodigo!: number;
  personaNombre!: string;
  personaApellido!: string;
  uaaCodigo!: number;
  roles: string[] = [];
  horaInicioSesion!: string;
}