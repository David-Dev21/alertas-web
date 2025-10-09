import type { RespuestaBase } from "../common.types";

/**
 * Tipos de salida (responses) para el módulo de usuarios del panel
 */

export interface UsuarioPanelResponse {
  id: string;
  grado: string;
  nombreCompleto: string;
  unidad: string;
}

export interface RespuestaObtenerUsuarioPanel extends RespuestaBase<{ usuario: UsuarioPanelResponse }> {}
