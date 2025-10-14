import { useState, useEffect, useCallback } from "react";
import { alertasService } from "@/services/alertas/alertasService";
import { Alerta, FiltrosUbicacion } from "@/services/alertas/alertasService";
import { EstadoCarga } from "@/types/common.types";

interface UseAlertasActivasResult extends EstadoCarga {
  alertas: Alerta[];
  refetch: () => Promise<void>;
}

interface UseAlertaDetalleResult extends EstadoCarga {
  alerta: Alerta | null;
  refetch: () => Promise<void>;
}

/**
 * Hook para obtener y manejar las alertas activas
 */
export function useAlertasActivas(filtros: FiltrosUbicacion = {}): UseAlertasActivasResult {
  const [alertas, setAlertas] = useState<Alerta[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const obtenerAlertasActivas = useCallback(async () => {
    try {
      setCargando(true);
      setError(null);

      // Obtener alertas activas desde el endpoint dedicado con filtros
      const alertasActivas = await alertasService.obtenerActivas(filtros);
      setAlertas(alertasActivas);
    } catch (err) {
      console.error("Error al obtener alertas activas:", err);
      setError("Error al cargar las alertas activas");
      setAlertas([]);
    } finally {
      setCargando(false);
    }
  }, [filtros]);

  const refetch = useCallback(async () => {
    await obtenerAlertasActivas();
  }, [obtenerAlertasActivas]);

  useEffect(() => {
    obtenerAlertasActivas();
  }, [obtenerAlertasActivas]);

  return {
    alertas,
    cargando,
    error,
    refetch,
  };
}

/**
 * Hook para obtener el detalle de una alerta específica
 */
export function useAlertaDetalle(idAlerta: string): UseAlertaDetalleResult {
  const [alerta, setAlerta] = useState<Alerta | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const obtenerAlertaDetalle = useCallback(async () => {
    if (!idAlerta || idAlerta === "undefined") return;

    try {
      setCargando(true);
      setError(null);

      const alertaDetalle = await alertasService.obtenerPorId(idAlerta);
      setAlerta(alertaDetalle);
    } catch (err) {
      console.error("Error al obtener detalle de alerta:", err);
      setError("Error al cargar el detalle de la alerta");
      setAlerta(null);
    } finally {
      setCargando(false);
    }
  }, [idAlerta]);

  const refetch = useCallback(async () => {
    await obtenerAlertaDetalle();
  }, [obtenerAlertaDetalle]);

  useEffect(() => {
    obtenerAlertaDetalle();
  }, [obtenerAlertaDetalle]);

  return {
    alerta,
    cargando,
    error,
    refetch,
  };
}
