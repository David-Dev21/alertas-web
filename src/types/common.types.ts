// Interfaces comunes para toda la aplicación

// Estructura base de respuesta del backend
export interface RespuestaBase<T = unknown> {
  exito: boolean;
  codigo: number;
  mensaje: string;
  datos?: T;
  error?: string;
}

// Estructura de paginación estándar del backend
export interface PaginacionBase {
  paginaActual: number;
  totalPaginas: number;
  totalElementos: number;
  elementosPorPagina: number;
}

// Respuesta paginada genérica
export interface RespuestaPaginada<T> {
  datos: T[];
  paginacion: PaginacionBase;
}

// Tipos comunes para manejo de estados en hooks
export interface EstadoCarga {
  cargando: boolean;
  error: string | null;
}

// Tipos para filtros y búsquedas
export interface ParametrosPaginacion {
  pagina?: number;
  limite?: number;
}

export interface ParametrosBusqueda extends ParametrosPaginacion {
  busqueda?: string;
}
