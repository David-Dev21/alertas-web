import api from "../baseApi";
import { Coordenadas } from "@/types/request/ubicaciones";
import { RespuestaDepartamentos, RespuestaProvincias, RespuestaMunicipios, RespuestaDepartamento } from "@/types/response/ubicaciones";

export const ubicacionesService = {
  obtenerDepartamentos: async (): Promise<RespuestaDepartamentos> => {
    const response = await api.get("/departamentos");
    return response.data;
  },

  obtenerProvinciasPorDepartamento: async (idDepartamento: number): Promise<RespuestaProvincias> => {
    const response = await api.get(`/departamentos/${idDepartamento}/provincias`);
    return response.data;
  },

  obtenerMunicipiosPorProvincia: async (idProvincia: number): Promise<RespuestaMunicipios> => {
    const response = await api.get(`/departamentos/provincias/${idProvincia}/municipios`);
    return response.data;
  },

  obtenerDepartamentoPorCoordenadas: async (coordenadas: Coordenadas): Promise<RespuestaDepartamento> => {
    const response = await api.get("/departamentos/encontrar", {
      params: coordenadas,
    });
    return response.data;
  },
};
