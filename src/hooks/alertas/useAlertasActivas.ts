import { useState, useEffect, useCallback } from 'react';
import { alertasService } from '@/services/alertas/alertasService';
import { Alerta } from '@/types/alertas/Alerta';

interface FiltrosUbicacion {
  idDepartamento?: number;
  idProvincia?: number;
  idMunicipio?: number;
}

interface UseAlertasActivasResult {
  alertas: Alerta[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

interface UseAlertaDetalleResult {
  alerta: Alerta | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

interface UseAlertasResult {
  alertas: Alerta[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Hook para obtener y manejar las alertas activas
 */
export function useAlertasActivas(filtros: FiltrosUbicacion = {}): UseAlertasActivasResult {
  const [alertas, setAlertas] = useState<Alerta[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const obtenerAlertasActivas = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Obtener alertas activas desde el endpoint dedicado con filtros
      const alertasActivas = await alertasService.obtenerActivas(filtros);
      setAlertas(alertasActivas);
    } catch (err) {
      console.error('Error al obtener alertas activas:', err);
      setError('Error al cargar las alertas activas');
      setAlertas([]);
    } finally {
      setLoading(false);
    }
  }, [filtros.idDepartamento, filtros.idProvincia, filtros.idMunicipio]);

  const refetch = useCallback(async () => {
    await obtenerAlertasActivas();
  }, [obtenerAlertasActivas]);

  useEffect(() => {
    obtenerAlertasActivas();
  }, [obtenerAlertasActivas]);

  return {
    alertas,
    loading,
    error,
    refetch,
  };
}

/**
 * Hook para obtener el detalle de una alerta específica
 */
export function useAlertaDetalle(idAlerta: string): UseAlertaDetalleResult {
  const [alerta, setAlerta] = useState<Alerta | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const obtenerAlertaDetalle = useCallback(async () => {
    if (!idAlerta || idAlerta === 'undefined') return;

    try {
      setLoading(true);
      setError(null);

      const alertaDetalle = await alertasService.obtenerPorId(idAlerta);
      setAlerta(alertaDetalle);
    } catch (err) {
      console.error('Error al obtener detalle de alerta:', err);
      setError('Error al cargar el detalle de la alerta');
      setAlerta(null);
    } finally {
      setLoading(false);
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
    loading,
    error,
    refetch,
  };
}

/**
 * Hook para obtener todas las alertas
 */
export function useAlertas(): UseAlertasResult {
  const [alertas, setAlertas] = useState<Alerta[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const obtenerAlertas = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Obtener todas las alertas usando el historial con un límite alto
      const datos = await alertasService.obtenerHistorial({ limite: 100 });
      setAlertas(datos.alertas || []);
    } catch (err) {
      console.error('Error al obtener todas las alertas:', err);
      setError('Error al cargar las alertas');
      setAlertas([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const refetch = useCallback(async () => {
    await obtenerAlertas();
  }, [obtenerAlertas]);

  useEffect(() => {
    obtenerAlertas();
  }, [obtenerAlertas]);

  return {
    alertas,
    loading,
    error,
    refetch,
  };
}
