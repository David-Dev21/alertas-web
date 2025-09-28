'use client';

import { useEffect, useCallback, useMemo } from 'react';
import { useFuncionariosStore, UbicacionFuncionario, calcularDistancia } from '@/stores/funcionarios/funcionariosStore';

/**
 * Hook para manejar ubicaciones de funcionarios en tiempo real
 * Recibe ubicaciones desde React Native a través del backend
 */
export function useFuncionariosUbicacion() {
  const {
    socket,
    isConnected,
    funcionarios,
    isLoading,
    inicializarSocket,
    cerrarSocket,
    obtenerFuncionariosPorAlerta,
    asignarFuncionario,
    desasignarFuncionario,
    obtenerFuncionariosAsignados,
  } = useFuncionariosStore();

  // Inicializar WebSocket al montar el hook - Solo una vez
  useEffect(() => {
    if (!socket) {
      inicializarSocket();
    }
  }, []); // Solo ejecutar una vez al montar

  /**
   * Calcular funcionarios más cercanos a una ubicación específica
   * Memoizado para evitar recálculos innecesarios
   */
  const obtenerFuncionariosCercanos = useCallback(
    (latitud: number, longitud: number, radioEnKm: number = 5): UbicacionFuncionario[] => {
      if (!funcionarios || funcionarios.length === 0) return [];

      return funcionarios
        .map((funcionario) => {
          const distancia = calcularDistancia(latitud, longitud, funcionario.ubicacion.latitud, funcionario.ubicacion.longitud);

          return {
            ...funcionario,
            distanciaEnMetros: Math.round(distancia * 1000),
          };
        })
        .filter((funcionario) => funcionario.disponible && funcionario.distanciaEnMetros! / 1000 <= radioEnKm)
        .sort((a, b) => a.distanciaEnMetros! - b.distanciaEnMetros!);
    },
    [funcionarios],
  );

  /**
   * Obtener funcionario más cercano a una ubicación
   * Memoizado para evitar recálculos innecesarios
   */
  const obtenerFuncionarioMasCercano = useCallback(
    (latitud: number, longitud: number, radioMaximoKm: number = 10): UbicacionFuncionario | null => {
      const cercanos = obtenerFuncionariosCercanos(latitud, longitud, radioMaximoKm);
      return cercanos.length > 0 ? cercanos[0] : null;
    },
    [obtenerFuncionariosCercanos],
  );

  // Métricas memoizadas para evitar recálculos
  const metricas = useMemo(
    () => ({
      totalFuncionariosConectados: funcionarios.length,
      funcionariosDisponibles: funcionarios.filter((f) => f.disponible).length,
      funcionariosOcupados: funcionarios.filter((f) => !f.disponible).length,
    }),
    [funcionarios],
  );

  /**
   * Obtener funcionarios disponibles para asignar a una alerta
   * Sin filtro de distancia - muestra TODOS los funcionarios que reportan ubicación
   */
  const obtenerFuncionariosDisponiblesParaAlerta = useCallback(
    (alertaId: string, latitudAlerta?: number, longitudAlerta?: number): UbicacionFuncionario[] => {
      // Obtener todos los funcionarios disponibles (no los asignados automáticamente)
      const funcionariosDisponibles = funcionarios.filter((f) => f.disponible);

      if (!latitudAlerta || !longitudAlerta) {
        return funcionariosDisponibles;
      }

      return funcionariosDisponibles
        .map((funcionario) => {
          const distancia = calcularDistancia(latitudAlerta, longitudAlerta, funcionario.ubicacion.latitud, funcionario.ubicacion.longitud);

          return {
            ...funcionario,
            distanciaEnMetros: Math.round(distancia * 1000),
          };
        })
        .sort((a, b) => (a.distanciaEnMetros || 0) - (b.distanciaEnMetros || 0));
    },
    [funcionarios],
  );

  /**
   * Obtener funcionarios realmente asignados a una alerta específica
   */
  const obtenerFuncionariosAsignadosCallback = useCallback(
    (alertaId: string, latitudAlerta?: number, longitudAlerta?: number): UbicacionFuncionario[] => {
      const funcionariosAsignados = obtenerFuncionariosAsignados(alertaId);

      if (!latitudAlerta || !longitudAlerta) {
        return funcionariosAsignados;
      }

      return funcionariosAsignados
        .map((funcionario) => {
          const distancia = calcularDistancia(latitudAlerta, longitudAlerta, funcionario.ubicacion.latitud, funcionario.ubicacion.longitud);

          return {
            ...funcionario,
            distanciaEnMetros: Math.round(distancia * 1000),
          };
        })
        .sort((a, b) => (a.distanciaEnMetros || 0) - (b.distanciaEnMetros || 0));
    },
    [obtenerFuncionariosAsignados],
  );

  return {
    // Estado
    funcionariosUbicaciones: funcionarios,
    isLoading,
    isConnected,

    // Métricas
    ...metricas,

    // Utilidades
    obtenerFuncionariosCercanos,
    obtenerFuncionarioMasCercano,
    obtenerFuncionariosDisponiblesParaAlerta,
    obtenerFuncionariosAsignadosCallback,

    // Acciones de asignación
    asignarFuncionario,
    desasignarFuncionario,

    // Acciones del socket
    cerrarConexion: cerrarSocket,
  };
}

// Exportar tipos para uso externo
export type { UbicacionFuncionario } from '@/stores/funcionarios/funcionariosStore';
