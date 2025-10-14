import baseApi from "@/services/baseApi";
import { RespuestaPaginada, ParametrosBusqueda, RespuestaBase } from "@/types/common.types";

export interface Agresor {
  id: string;
  cedulaIdentidad: string;
  nombres: string;
  apellidos: string;
}

export interface CrearAgresorRequest {
  cedulaIdentidad: string;
  nombres: string;
  apellidos: string;
}

export interface AgresorConParentesco {
  idAgresor: string;
  parentesco: string;
}

export interface CerrarAlertaRequest {
  idUsuarioWeb: string;
  motivoCierre: "RESUELTA" | "FALSA_ALERTA";
  fechaHora: string;
  estadoVictima?: string;
  agresores?: AgresorConParentesco[];
  observaciones: string;
}

// Tipos de respuesta usando interfaces comunes
type DatosAgresores = RespuestaPaginada<Agresor>;

export const agresorService = {
  obtenerTodos: async (parametros: ParametrosBusqueda = {}): Promise<DatosAgresores> => {
    const queryParams = new URLSearchParams();
    if (parametros.pagina) queryParams.append("pagina", parametros.pagina.toString());
    if (parametros.limite) queryParams.append("limite", parametros.limite.toString());
    if (parametros.busqueda) queryParams.append("busqueda", parametros.busqueda);

    const response = await baseApi.get(`/agresores?${queryParams.toString()}`);
    return response.data;
  },

  buscarPorCedula: async (cedula: string): Promise<Agresor | null> => {
    const response = await baseApi.get(`/agresores/${cedula}`);
    return response.data || null;
  },

  crear: async (datos: CrearAgresorRequest): Promise<Agresor> => {
    const response = await baseApi.post("/agresores", datos);
    return response.data;
  },

  cerrarAlerta: async (idAlerta: string, datos: CerrarAlertaRequest): Promise<RespuestaBase<void>> => {
    const response = await baseApi.post(`/cierre-alertas/${idAlerta}`, datos);
    return response.data;
  },
};
