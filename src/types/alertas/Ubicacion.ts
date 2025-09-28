// Tipos para manejo de ubicaciones y geografía

export interface Coordenadas {
  latitud: number;
  longitud: number;
}

export interface UbicacionCompleta extends Coordenadas {
  direccion?: string;
  referencias?: string;
  precision?: number;
  timestamp?: string;
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

export interface ZonaCobertura {
  id: string;
  nombre: string;
  descripcion?: string;
  poligono: Coordenadas[]; // Array de coordenadas que forman el polígono
  idDepartamento: number;
  activa: boolean;
}

export interface RutaTracking {
  id: string;
  puntos: UbicacionCompleta[];
  distanciaTotal?: number; // en metros
  tiempoTotal?: number; // en segundos
  velocidadPromedio?: number; // en km/h
  fechaInicio: string;
  fechaFin?: string;
}

// Funciones auxiliares para cálculos geográficos
export function calcularDistancia(punto1: Coordenadas, punto2: Coordenadas): number {
  const R = 6371; // Radio de la Tierra en km
  const dLat = ((punto2.latitud - punto1.latitud) * Math.PI) / 180;
  const dLon = ((punto2.longitud - punto1.longitud) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((punto1.latitud * Math.PI) / 180) * Math.cos((punto2.latitud * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function formatearCoordenadas(coordenadas: Coordenadas): string {
  return `${coordenadas.latitud.toFixed(6)}, ${coordenadas.longitud.toFixed(6)}`;
}

export function validarCoordenadas(coordenadas: Coordenadas): boolean {
  return coordenadas.latitud >= -90 && coordenadas.latitud <= 90 && coordenadas.longitud >= -180 && coordenadas.longitud <= 180;
}
