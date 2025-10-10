// Tipos para manejo de ubicaciones y geografía

export interface Coordenadas {
  latitud: number;
  longitud: number;
}

export interface Departamento {
  id: number;
  nombre: string;
  codigo: string;
  provincias?: Provincia[];
}

export interface Provincia {
  id: number;
  nombre: string;
  codigo: string;
  idDepartamento: number;
  municipios?: Municipio[];
}

export interface Municipio {
  id: number;
  nombre: string;
  codigo: string;
  idProvincia: number;
}

export interface FiltrosUbicacion {
  idDepartamento?: number;
  idProvincia?: number;
  idMunicipio?: number;
}
