import type { RespuestaBase } from "../common.types";
import { Alerta } from "../alertas/Alerta";

/**
 * Tipos de salida (responses) para el módulo de alertas
 */

export interface RespuestaBuscarAgresor
  extends RespuestaBase<{
    id: string;
    cedulaIdentidad: string;
    nombreCompleto: string;
    parentesco: string;
  }> {}

export interface RespuestaCrearAgresor
  extends RespuestaBase<{
    id: string;
    cedulaIdentidad: string;
    nombreCompleto: string;
    parentesco: string;
  }> {}

export interface RespuestaHistorialAlertas
  extends RespuestaBase<{
    historial: Alerta[];
    paginacion: {
      paginaActual: number;
      totalPaginas: number;
      totalElementos: number;
      elementosPorPagina: number;
    };
  }> {}
