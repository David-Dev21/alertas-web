import { useEffect, useState, useCallback } from "react";
import { victimasService, Victima } from "@/services/victimas/victimasService";
import { EstadoCarga } from "@/types/common.types";

// Interfaces específicas del hook (las demás se importan del servicio)
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

export interface EstadoHistorialVictima extends EstadoCarga {
  datos: HistorialAlertasVictima | null;
}

export function useHistorialVictima(idVictima: string) {
  const [estado, setEstado] = useState<EstadoHistorialVictima>({
    datos: null,
    cargando: true,
    error: null,
  });

  const cargarHistorial = useCallback(async () => {
    try {
      setEstado((previo) => ({ ...previo, cargando: true, error: null }));
      const respuesta = await victimasService.obtenerHistorialAlertas(idVictima);
      setEstado((previo) => ({
        ...previo,
        datos: respuesta,
        cargando: false,
      }));
    } catch (err) {
      setEstado((previo) => ({
        ...previo,
        cargando: false,
        error: err instanceof Error ? err.message : "Error al cargar el historial de alertas",
      }));
      console.error(err);
    }
  }, [idVictima]);

  const reintentar = () => {
    cargarHistorial();
  };

  useEffect(() => {
    if (idVictima) {
      cargarHistorial();
    }
  }, [idVictima, cargarHistorial]);

  return {
    // Datos principales
    historial: estado.datos,
    // Estados de carga
    cargando: estado.cargando,
    error: estado.error,
    // Funciones
    reintentar,
  };
}
