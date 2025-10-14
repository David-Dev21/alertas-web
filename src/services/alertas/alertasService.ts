import api from "@/services/baseApi";
import { OrigenAlerta, EstadoAlerta, EstadoSolicitudCancelacion, EstadoCuenta, TipoEvento } from "@/types/enums";
import { RespuestaPaginada } from "@/types/common.types";

// De alertas/Ubicacion.ts
export interface FiltrosUbicacion {
  idDepartamento?: number;
  idProvincia?: number;
  idMunicipio?: number;
}
// Para rutas de seguimiento (RutaAlerta, RutaFuncionario)
interface RutaLineString {
  type: "Feature";
  geometry: {
    type: "LineString";
    coordinates: [number, number][]; // Array de [longitude, latitude]
  };
}

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

export interface Evento {
  id: string;
  tipoEvento: TipoEvento;
  fechaHora: string;
  ubicacion?: UbicacionPoint | null;
  funcionarioExterno?: string | null;
}

interface RutaAlerta {
  id: string;
  idAlerta: string;
  ruta: RutaLineString;
  precisionGps?: number;
  creadoEn: string;
  actualizadoEn: string;
  eliminadoEn?: string;
}

// De response/victimas.ts
export interface Direccion {
  zona: string;
  calle: string;
  numero: string;
  referencia: string;
}

export interface ContactoEmergencia {
  id?: string;
  parentesco: string;
  nombreCompleto: string;
  celular: string;
  principal: boolean;
}

export interface Victima {
  id: string;
  cedulaIdentidad: string;
  nombreCompleto?: string;
  nombres: string;
  apellidos: string;
  fechaNacimiento?: string;
  celular: string;
  correo?: string;
  estadoCuenta?: EstadoCuenta;
  creadoEn?: string;
  idMunicipio?: number;
  direccion?: Direccion;
  contactosEmergencia?: ContactoEmergencia[];
}

// De response/atenciones.ts
export interface FuncionarioAsignado {
  id: string;
  idAtencion: string;
  idFuncionario: string;
  rolAtencion: string;
  ubicacion: UbicacionPoint | null;
  turnoInicio: string;
  turnoFin: string;
  grado: string;
  nombreCompleto: string;
  unidad: string;
  funcionarioExterno?: {
    grado: string;
    nombreCompleto: string;
    organismo?: string;
    unidad: string;
  };
  creadoEn: string;
  actualizadoEn: string;
  eliminadoEn?: string;
  rutaFuncionario?: RutaFuncionario;
}

interface RutaFuncionario {
  id: string;
  idAtencionFuncionario: string;
  ruta: RutaLineString;
  precisionGps?: number;
  realizado?: string;
  actualizadoEn: string;
  eliminadoEn?: string;
}

// De response/solicitudes-cancelacion.ts
// Enum movido a src/types/enums.ts

interface VictimaSolicitud {
  id: string;
  nombres: string;
  apellidos: string;
  cedulaIdentidad: string;
  celular: string;
}

interface SolicitudCancelacion {
  id: string;
  idAlerta: string;
  fechaSolicitud: string;
  estadoSolicitud: EstadoSolicitudCancelacion;
  motivoCancelacion: string;
  victima: VictimaSolicitud;
}

export interface Alerta {
  id: string;
  idVictima: string;
  idMunicipio?: number;
  fechaHora: string;
  codigoCud?: string;
  codigoRegistro?: string;
  estadoAlerta: EstadoAlerta;
  ubicacion?: UbicacionPoint;
  origen: OrigenAlerta;
  municipio?: string;
  provincia?: string;
  departamento?: string;

  // Relaciones
  victima?: Victima;
  atencion?: Atencion;
  eventos?: Evento[];
  cierre?: CierreAlerta;
  rutaAlerta?: RutaAlerta;
  solicitudesCancelacion?: SolicitudCancelacion[];
}

interface Atencion {
  id: string;
  idAlerta: string;
  idUsuario: string;
  siglaVehiculo?: string;
  siglaRadio?: string;
  creadoEn: string;
  actualizadoEn: string;
  eliminadoEn?: string;
  atencionFuncionario?: FuncionarioAsignado[];
}

export interface CierreAlerta {
  usuarioAdmin: string;
  fechaHora: string;
  estadoVictima: string;
  idAgresor?: string | null;
  motivoCierre: string;
  observaciones: string;
}

// De request/alertas.ts
interface DatosCrearAgresor {
  cedulaIdentidad: string;
  nombres: string;
  apellidos: string;
  parentesco: string;
}

interface DatosCierreAlerta {
  usuarioAdmin: string;
  fechaHora: string;
  estadoVictima: string;
  idAgresor?: string | null;
  motivoCierre: string;
  observaciones: string;
}

interface ParametrosHistorial {
  pagina?: number;
  limite?: number;
  fechaInicio?: string;
  fechaFin?: string;
  estado?: string;
  municipio?: string;
}

// Interfaces de datos (lo que devuelve baseApi)
interface DatosBuscarAgresor {
  id: string;
  cedulaIdentidad: string;
  nombreCompleto: string;
  parentesco: string;
}

interface DatosCrearAgresorRequest {
  cedulaIdentidad: string;
  nombres: string;
  apellidos: string;
  parentesco: string;
}

interface DatosCrearAgresor {
  id: string;
  cedulaIdentidad: string;
  nombreCompleto: string;
  parentesco: string;
}

export const alertasService = {
  obtenerPorId: async (id: string): Promise<Alerta> => {
    const response = await api.get(`/alertas/${id}/detalle`);
    return response.data.alerta;
  },

  obtenerActivas: async (filtros: FiltrosUbicacion = {}): Promise<Alerta[]> => {
    const response = await api.get("/alertas/alertas-activas", { params: filtros });
    return response.data?.alertas || [];
  },

  cerrar: async (idAlerta: string, datoCierre: DatosCierreAlerta): Promise<Alerta> => {
    const response = await api.post(`/cierre-alertas/${idAlerta}`, datoCierre);
    return response.data.alerta;
  },

  buscarAgresor: async (cedula: string): Promise<DatosBuscarAgresor> => {
    const response = await api.get(`/cierre-alertas/agresores/${cedula}`);
    return response.data;
  },

  crearAgresor: async (datosAgresor: DatosCrearAgresorRequest): Promise<DatosCrearAgresor> => {
    const response = await api.post("/cierre-alertas/agresores", datosAgresor);
    return response.data;
  },

  obtenerHistorial: async (parametros: ParametrosHistorial = {}): Promise<RespuestaPaginada<Alerta>> => {
    const response = await api.get("/alertas/historial-alertas", { params: parametros });
    return response.data;
  },
};
