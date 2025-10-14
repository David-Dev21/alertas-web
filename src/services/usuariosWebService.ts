import baseApi from "./baseApi";
import { RespuestaPaginada, ParametrosBusqueda } from "@/types/common.types";

export interface UsuarioWeb {
  id: string;
  grado: string;
  nombreCompleto: string;
  unidad: string;
  estadoSession: boolean;
  actualizadoEn: string;
}

// Interfaces de request
interface ParametrosConsultaUsuariosWeb extends ParametrosBusqueda {
  estadoSession?: boolean;
}

// Tipos de respuesta usando interfaces comunes
type DatosUsuariosWeb = RespuestaPaginada<UsuarioWeb>;

export const usuariosWebService = {
  obtenerTodos: async (parametros: ParametrosConsultaUsuariosWeb = {}): Promise<DatosUsuariosWeb> => {
    const queryParams = new URLSearchParams();
    if (parametros.pagina) queryParams.append("pagina", parametros.pagina.toString());
    if (parametros.limite) queryParams.append("limite", parametros.limite.toString());
    if (parametros.busqueda) queryParams.append("busqueda", parametros.busqueda);
    if (parametros.estadoSession !== undefined) queryParams.append("estadoSession", parametros.estadoSession.toString());

    const response = await baseApi.get(`/usuarios-web?${queryParams.toString()}`);
    return response.data;
  },
};
