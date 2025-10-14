import api from "../baseApi";
import { RolAtencion } from "@/types/enums";

// Interfaces de request
interface UbicacionPoint {
  type: "Feature";
  geometry: {
    type: "Point";
    coordinates: [number, number]; // [longitude, latitude]
  };
  properties: {
    accuracy: number; // metros de precisión
    timestamp: string; // ISO 8601
  };
}

interface FuncionarioAtencion {
  rolAtencion: RolAtencion;
  ubicacion?: UbicacionPoint;
  turnoInicio: string;
  turnoFin: string;
}

interface CrearAtencionRequest {
  idAlerta: string;
  idUsuarioPanel: string;
  siglaVehiculo: string;
  siglaRadio: string;
  funcionarios: FuncionarioAtencion[];
}

// Interfaces de response
interface AtencionCreada {
  id: string;
  idAlerta: string;
  idUsuarioPanel: string;
  siglaVehiculo?: string;
  siglaRadio?: string;
  funcionarios: FuncionarioAtencion[];
  creadoEn: string;
  actualizadoEn: string;
}

export const atencionesService = {
  crearAtencion: async (data: CrearAtencionRequest): Promise<AtencionCreada> => {
    const response = await api.post("/atenciones", data);
    return response.data;
  },
};
