import baseApi from "./baseApi";

export interface Personal {
  id: string;
  grado: string;
  nombreCompleto: string;
  unidad: string;
  escalafon: string;
  idDepartamento: number;
  creadoEn: string;
  actualizadoEn: string;
  departamento: string;
}

export interface PaginacionPersonal {
  paginaActual: number;
  totalPaginas: number;
  totalElementos: number;
  elementosPorPagina: number;
}

export interface DatosPersonal {
  personal: Personal[];
  paginacion: PaginacionPersonal;
}

export interface ObtenerPersonalResponse {
  exito: boolean;
  codigo: number;
  mensaje: string;
  datos: {
    datos: DatosPersonal;
  };
}

export interface CrearPersonalRequest {
  grado: string;
  nombreCompleto: string;
  unidad: string;
  escalafon: string;
  idDepartamento: number;
}

export interface BuscarPersonalResponse {
  exito: boolean;
  codigo: number;
  mensaje: string;
  datos: {
    personal: Personal[];
    total: number;
  };
}

export interface CrearPersonalResponse {
  exito: boolean;
  codigo: number;
  mensaje: string;
  datos: Personal;
}

export const personalService = {
  obtenerTodos: async (
    parametros: {
      pagina?: number;
      limite?: number;
      busqueda?: string;
      idDepartamento?: number;
    } = {}
  ): Promise<ObtenerPersonalResponse> => {
    const queryParams = new URLSearchParams();
    if (parametros.pagina) queryParams.append("pagina", parametros.pagina.toString());
    if (parametros.limite) queryParams.append("limite", parametros.limite.toString());
    if (parametros.busqueda) queryParams.append("busqueda", parametros.busqueda);
    if (parametros.idDepartamento) queryParams.append("idDepartamento", parametros.idDepartamento.toString());

    const response = await baseApi.get(`/personal?${queryParams.toString()}`);
    return response.data;
  },

  buscarPersonal: async (busqueda: string, idDepartamento: number): Promise<BuscarPersonalResponse> => {
    const response = await baseApi.get(`/personal/buscar?busqueda=${encodeURIComponent(busqueda)}&idDepartamento=${idDepartamento}`);
    return response.data;
  },

  crearPersonal: async (datos: CrearPersonalRequest): Promise<CrearPersonalResponse> => {
    const response = await baseApi.post("/personal", datos);
    return response.data;
  },
};
