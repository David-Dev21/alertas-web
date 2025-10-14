import api from "../baseApi";

// Interfaces de request
interface Coordenadas {
  latitud: number;
  longitud: number;
}

// Interfaces de response
export interface Departamento {
  id: number;
  departamento: string;
}

export interface Provincia {
  id: number;
  provincia: string;
}

export interface Municipio {
  id: number;
  municipio: string;
}

interface DatosDepartamento {
  departamento: {
    id: number;
    departamento: string;
  };
}

export const ubicacionesService = {
  obtenerDepartamentos: async (): Promise<Departamento[]> => {
    const response = await api.get("/departamentos");
    return response.data;
  },

  obtenerProvinciasPorDepartamento: async (idDepartamento: number): Promise<Provincia[]> => {
    const response = await api.get(`/departamentos/${idDepartamento}/provincias`);
    return response.data;
  },

  obtenerMunicipiosPorProvincia: async (idProvincia: number): Promise<Municipio[]> => {
    const response = await api.get(`/departamentos/provincias/${idProvincia}/municipios`);
    return response.data;
  },

  obtenerDepartamentoPorCoordenadas: async (coordenadas: Coordenadas): Promise<DatosDepartamento> => {
    const response = await api.get("/departamentos/encontrar", {
      params: coordenadas,
    });
    return response.data;
  },
};
