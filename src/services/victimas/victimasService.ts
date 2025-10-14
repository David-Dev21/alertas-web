import api from "@/services/baseApi";
import { EstadoCuenta } from "@/types/enums";
import { RespuestaPaginada, ParametrosBusqueda } from "@/types/common.types";

// Interfaces específicas del servicio de víctimas
interface ParametrosConsultaVictimas extends ParametrosBusqueda {
  cedulaIdentidad?: string;
  nombreCompleto?: string;
  telefonoValidado?: boolean;
  estadoCuenta?: EstadoCuenta;
}

// De response/victimas.ts
interface Direccion {
  zona: string;
  calle: string;
  numero: string;
  referencia: string;
}

interface ContactoEmergencia {
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

// Tipos de respuesta usando interfaces comunes
type DatosVictimas = RespuestaPaginada<Victima>;

interface AlertaHistorial {
  idAlerta: string;
  fechaHora: string;
  estadoAlerta: string;
  origen: string;
  idMunicipio: number;
  codigoCud: string;
  codigoRegistro: string;
  tiempoAsignacion: string;
  tiempoCierre: string;
  creadoEn: string;
  municipio: string;
  provincia: string;
  departamento: string;
}

interface EstadisticasVictima {
  totalAlertas: number;
  alertasActivas: number;
  alertasFinalizadas: number;
  alertasPorEstado: Record<string, number>;
}

interface HistorialAlertasVictima {
  victima: Victima;
  estadisticas: EstadisticasVictima;
  alertas: AlertaHistorial[];
}

export const victimasService = {
  obtenerTodas: async (parametros: ParametrosConsultaVictimas = {}): Promise<DatosVictimas> => {
    const response = await api.get("/victimas", { params: parametros });
    return response.data;
  },

  obtenerHistorialAlertas: async (idVictima: string): Promise<HistorialAlertasVictima> => {
    const response = await api.get(`/victimas/${idVictima}/historial-alertas`);
    return response.data;
  },
};
