/**
 * Tipos comunes utilizados en toda la aplicación
 */

export interface RespuestaBase<T = any> {
  exito: boolean;
  mensaje?: string;
  datos?: T;
  errores?: string[];
}
