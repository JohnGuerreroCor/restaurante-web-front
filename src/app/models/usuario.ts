export class Usuario {
  id!: number;
  username!: string;
  password!: string;
  per_codigo!: number;
  nombre!: String;
  apellido!: String;
  uaa!: String;
  uaaCodigo!: number;
  roles : string[] = [];
}