import baseApi from "./baseApi";

export interface UsuarioWeb {
  id: string;
  grado: string;
  nombreCompleto: string;
  unidad: string;
  estadoSession: boolean;
  actualizadoEn: string;
}

export interface PaginacionUsuariosWeb {
  paginaActual: number;
  totalPaginas: number;
  totalElementos: number;
  elementosPorPagina: number;
}

export interface DatosUsuariosWeb {
  usuarios: UsuarioWeb[];
  paginacion: PaginacionUsuariosWeb;
}

export interface ObtenerUsuariosWebResponse {
  exito: boolean;
  codigo: number;
  mensaje: string;
  datos: DatosUsuariosWeb;
}

export const usuariosWebService = {
  obtenerTodos: async (
    parametros: {
      pagina?: number;
      limite?: number;
      busqueda?: string;
      estadoSession?: boolean;
    } = {}
  ): Promise<ObtenerUsuariosWebResponse> => {
    const queryParams = new URLSearchParams();
    if (parametros.pagina) queryParams.append("pagina", parametros.pagina.toString());
    if (parametros.limite) queryParams.append("limite", parametros.limite.toString());
    if (parametros.busqueda) queryParams.append("busqueda", parametros.busqueda);
    if (parametros.estadoSession !== undefined) queryParams.append("estadoSession", parametros.estadoSession.toString());

    const response = await baseApi.get(`/usuarios-web?${queryParams.toString()}`);
    return response.data;
  },
};
