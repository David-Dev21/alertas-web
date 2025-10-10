'use client';

import { useState, useEffect, useCallback } from 'react';
import { alertasService } from '@/services/alertas/alertasService';
import { Alerta } from '@/types/alertas/Alerta';

export interface EstadoHistorial {
  alertas: Alerta[];
  paginacion: {
    paginaActual: number;
    totalPaginas: number;
    totalElementos: number;
    elementosPorPagina: number;
  };
  cargando: boolean;
  error: string | null;
}

export function useHistorialAlertas() {
  const [estado, setEstado] = useState<EstadoHistorial>({
    alertas: [],
    paginacion: { paginaActual: 1, totalPaginas: 0, totalElementos: 0, elementosPorPagina: 10 },
    cargando: true,
    error: null,
  });

  const [parametros, setParametros] = useState<{
    pagina?: number;
    limite?: number;
    busqueda?: string;
    origen?: string;
    idDepartamento?: number;
    idProvincia?: number;
    idMunicipio?: number;
    fechaDesde?: string;
    fechaHasta?: string;
  }>({});

  const cargar = useCallback(
    async (nuevosParametros?: {
      pagina?: number;
      limite?: number;
      busqueda?: string;
      origen?: string;
      idDepartamento?: number;
      idProvincia?: number;
      idMunicipio?: number;
      fechaDesde?: string;
      fechaHasta?: string;
    }) => {
      try {
        setEstado((p) => ({ ...p, cargando: true, error: null }));

        const final = { ...parametros, ...nuevosParametros };
        const datos = await alertasService.obtenerHistorial(final);

        setEstado({
          alertas: datos.historial || [],
          paginacion: datos.paginacion || { paginaActual: 1, totalPaginas: 0, totalElementos: 0, elementosPorPagina: final.limite || 10 },
          cargando: false,
          error: null,
        });

        if (nuevosParametros) setParametros(final);
      } catch (error) {
        console.error('Error cargando historial:', error);
        setEstado((p) => ({ ...p, cargando: false, error: error instanceof Error ? error.message : 'Error desconocido' }));
      }
    },
    [parametros],
  );

  useEffect(() => {
    cargar();
  }, []);

  const refrescar = useCallback(() => cargar(), [cargar]);

  const irAPagina = useCallback((nuevaPagina: number) => cargar({ pagina: nuevaPagina }), [cargar]);

  const cambiarLimite = useCallback((nuevoLimite: number) => cargar({ limite: nuevoLimite, pagina: 1 }), [cargar]);

  const buscar = useCallback(
    (filtros: {
      busqueda?: string;
      origen?: string;
      idDepartamento?: number;
      idProvincia?: number;
      idMunicipio?: number;
      fechaDesde?: string;
      fechaHasta?: string;
    }) => cargar({ ...filtros, pagina: 1 }),
    [cargar],
  );

  return { ...estado, parametros, refrescar, irAPagina, cambiarLimite, buscar, cargar };
}

export default useHistorialAlertas;
