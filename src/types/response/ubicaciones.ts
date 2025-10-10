// Tipos de respuesta para el módulo de ubicaciones

import { RespuestaBase } from "@/types/common.types";

export interface Departamento {
  id: number;
  departamento: string;
}

export interface Provincia {
  id: number;
  provincia: string;
}

export interface Municipio {
  id: number;
  municipio: string;
}

export interface DatosDepartamento {
  departamento: {
    id: number;
    departamento: string;
  };
}

export interface RespuestaDepartamentos extends RespuestaBase<Departamento[]> {}

export interface RespuestaProvincias extends RespuestaBase<Provincia[]> {}

export interface RespuestaMunicipios extends RespuestaBase<Municipio[]> {}

export interface RespuestaDepartamento extends RespuestaBase<DatosDepartamento> {}
