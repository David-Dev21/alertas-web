import baseApi from "./baseApi";
import { RespuestaPaginada, ParametrosBusqueda } from "@/types/common.types";

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

// Interfaces de request
interface ParametrosConsultaPersonal extends ParametrosBusqueda {
  idDepartamento?: number;
}

interface CrearPersonalRequest {
  grado: string;
  nombreCompleto: string;
  unidad: string;
  escalafon: string;
  idDepartamento: number;
}

// Tipos de respuesta usando interfaces comunes
type DatosPersonal = RespuestaPaginada<Personal>;

export const personalService = {
  obtenerTodos: async (parametros: ParametrosConsultaPersonal = {}): Promise<DatosPersonal> => {
    const queryParams = new URLSearchParams();
    if (parametros.pagina) queryParams.append("pagina", parametros.pagina.toString());
    if (parametros.limite) queryParams.append("limite", parametros.limite.toString());
    if (parametros.busqueda) queryParams.append("busqueda", parametros.busqueda);
    if (parametros.idDepartamento) queryParams.append("idDepartamento", parametros.idDepartamento.toString());

    const response = await baseApi.get(`/personal?${queryParams.toString()}`);
    return response.data;
  },

  buscarPersonal: async (busqueda: string, idDepartamento: number): Promise<Personal[]> => {
    const response = await baseApi.get(`/personal/buscar?busqueda=${encodeURIComponent(busqueda)}&idDepartamento=${idDepartamento}`);
    return response.data;
  },

  crearPersonal: async (datos: CrearPersonalRequest): Promise<Personal> => {
    const response = await baseApi.post("/personal", datos);
    return response.data;
  },

  actualizarPersonal: async (id: string, datos: Partial<CrearPersonalRequest>): Promise<Personal> => {
    const response = await baseApi.patch(`/personal/${id}`, datos);
    return response.data;
  },
};
