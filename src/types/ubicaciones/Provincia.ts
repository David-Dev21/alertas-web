export interface Provincia {
  id: number;
  provincia: string;
}

export interface RespuestaProvincias {
  exito: boolean;
  codigo: number;
  mensaje: string;
  datos: Provincia[];
}
