import baseApi from "../baseApi";

// Tipos para las respuestas
interface RespuestaApi<T> {
  exito: boolean;
  codigo: number;
  mensaje: string;
  datos: T;
}

export interface MetricasGenerales {
  alertasActivas: number;
  alertasPendientes: number;
  alertasResueltas: number;
  tiempoPromedioAsignacion: string;
  tiempoPromedioAtencionTotal: string;
  tiempoPromedioRegistro: string;
}

export interface AlertaGeografica {
  nombreDepartamento: string;
  totalAlertas: number;
  alertasActivas: number;
  alertasPendientes: number;
  alertasResueltas: number;
}

export interface Provincia {
  nombreProvincia: string;
  nombreDepartamento: string;
  totalAlertas: number;
  alertasActivas: number;
}

export interface Municipio {
  idMunicipio: number;
  nombreMunicipio: string;
  nombreProvincia: string;
  nombreDepartamento: string;
  totalAlertas: number;
  alertasActivas: number;
}

export interface AlertasGeograficas {
  departamentos: AlertaGeografica[];
  provincias: Provincia[];
  municipios: Municipio[];
}

export interface MetricaPorOrigen {
  origen: string;
  tiempoPromedioAsignacion: string;
  tiempoPromedioAtencionTotal: string;
  cantidadAlertas: number;
}

export interface MetricasTiempo {
  tiempoPromedioAsignacion: string;
  tiempoPromedioAtencionTotal: string;
  tiempoPromedioRegistro: string;
  metricasPorOrigen: MetricaPorOrigen[];
}

// Función para obtener métricas generales
export const obtenerMetricasGenerales = async (): Promise<MetricasGenerales> => {
  try {
    const response = await baseApi.get<RespuestaApi<MetricasGenerales>>("/dashboard/metricas-generales");
    if (response.data.exito) {
      return response.data.datos;
    } else {
      throw new Error(response.data.mensaje);
    }
  } catch (error) {
    console.error("Error obteniendo métricas generales:", error);
    throw error;
  }
};

// Función para obtener alertas geográficas
export const obtenerAlertasGeograficas = async (): Promise<AlertasGeograficas> => {
  try {
    const response = await baseApi.get<RespuestaApi<AlertasGeograficas>>("/dashboard/alertas-geograficas");
    if (response.data.exito) {
      return response.data.datos;
    } else {
      throw new Error(response.data.mensaje);
    }
  } catch (error) {
    console.error("Error obteniendo alertas geográficas:", error);
    throw error;
  }
};

// Función para obtener métricas de tiempo
export const obtenerMetricasTiempo = async (): Promise<MetricasTiempo> => {
  try {
    const response = await baseApi.get<RespuestaApi<MetricasTiempo>>("/dashboard/metricas-tiempo");
    if (response.data.exito) {
      return response.data.datos;
    } else {
      throw new Error(response.data.mensaje);
    }
  } catch (error) {
    console.error("Error obteniendo métricas de tiempo:", error);
    throw error;
  }
};
