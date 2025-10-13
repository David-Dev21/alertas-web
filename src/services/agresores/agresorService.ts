import baseApi from "@/services/baseApi";

export interface Agresor {
  id: string;
  cedulaIdentidad: string;
  nombres: string;
  apellidos: string;
}

export interface PaginacionAgresores {
  paginaActual: number;
  totalPaginas: number;
  totalElementos: number;
  elementosPorPagina: number;
}

export interface DatosAgresores {
  agresores: Agresor[];
  paginacion: PaginacionAgresores;
}

export interface ObtenerAgresoresResponse {
  exito: boolean;
  codigo: number;
  mensaje: string;
  datos: DatosAgresores;
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

export const agresorService = {
  obtenerTodos: async (
    parametros: {
      pagina?: number;
      limite?: number;
      busqueda?: string;
    } = {}
  ): Promise<ObtenerAgresoresResponse> => {
    const queryParams = new URLSearchParams();
    if (parametros.pagina) queryParams.append("pagina", parametros.pagina.toString());
    if (parametros.limite) queryParams.append("limite", parametros.limite.toString());
    if (parametros.busqueda) queryParams.append("busqueda", parametros.busqueda);

    const response = await baseApi.get(`/agresores?${queryParams.toString()}`);
    return response.data;
  },

  buscarPorCedula: async (cedula: string): Promise<Agresor | null> => {
    try {
      const response = await baseApi.get(`/agresores/${cedula}`);
      // El backend envuelve la respuesta en un objeto con exito/datos
      if (response.data && response.data.exito === true && response.data.datos) {
        return response.data.datos;
      }
      return null;
    } catch (error) {
      return null;
    }
  },

  crear: async (datos: CrearAgresorRequest): Promise<Agresor> => {
    const response = await baseApi.post("/agresores", datos);
    if (response.data && response.data.exito === true && response.data.datos) {
      return response.data.datos;
    }
    throw new Error(response.data?.mensaje || "Error al crear agresor");
  },

  cerrarAlerta: async (idAlerta: string, datos: CerrarAlertaRequest): Promise<void> => {
    const response = await baseApi.post(`/cierre-alertas/${idAlerta}`, datos);
    if (response.data && response.data.exito === false) {
      throw new Error(response.data.mensaje || "Error al cerrar alerta");
    }
  },
};
