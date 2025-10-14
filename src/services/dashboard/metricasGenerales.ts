import baseApi from "../baseApi";

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

// Funciones del servicio
export const obtenerMetricasGenerales = async (): Promise<MetricasGenerales> => {
  const response = await baseApi.get("/dashboard/metricas-generales");
  return response.data;
};

export const obtenerAlertasGeograficas = async (): Promise<AlertasGeograficas> => {
  const response = await baseApi.get("/dashboard/alertas-geograficas");
  return response.data;
};

export const obtenerMetricasTiempo = async (): Promise<MetricasTiempo> => {
  const response = await baseApi.get("/dashboard/metricas-tiempo");
  return response.data;
};
