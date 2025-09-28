export interface Departamento {
  id: number;
  departamento: string;
}

export interface RespuestaDepartamentos {
  exito: boolean;
  codigo: number;
  mensaje: string;
  datos: Departamento[];
}
