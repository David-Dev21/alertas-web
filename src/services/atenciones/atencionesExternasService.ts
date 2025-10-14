import api from "../baseApi";
import { RolAtencion } from "@/types/enums";
import { RespuestaBase } from "@/types/common.types";

// Interfaces de request
interface FuncionarioExternoAtencion {
  rolAtencion: RolAtencion;
  ubicacion?: {
    longitud: number;
    latitud: number;
    precision: number;
    marcaTiempo: string;
  };
  turnoInicio: string;
  turnoFin: string;
  idPersonal: string;
}

interface AgregarFuncionarioExternoRequest {
  rolAtencion: RolAtencion;
  ubicacion?: {
    longitud: number;
    latitud: number;
    precision: number;
    marcaTiempo: string;
  };
  turnoInicio: string;
  turnoFin: string;
  idPersonal: string;
}

interface CrearAtencionExternaRequest {
  idAlerta: string;
  idUsuarioWeb: string;
  siglaVehiculo: string;
  siglaRadio: string;
  funcionarios: FuncionarioExternoAtencion[];
}

export const atencionesExternasService = {
  crearAtencionExterna: async (data: CrearAtencionExternaRequest): Promise<RespuestaBase<void>> => {
    const response = await api.post("/atenciones-externos", data);
    return response.data;
  },

  agregarFuncionarioExterno: async (idAtencion: string, data: AgregarFuncionarioExternoRequest): Promise<RespuestaBase<void>> => {
    const response = await api.post(`/atenciones-externos/${idAtencion}/funcionarios-externos`, data);
    return response.data;
  },
};
