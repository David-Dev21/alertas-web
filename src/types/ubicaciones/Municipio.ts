export interface Municipio {
  id: number;
  municipio: string;
}

export interface RespuestaMunicipios {
  exito: boolean;
  codigo: number;
  mensaje: string;
  datos: Municipio[];
}
