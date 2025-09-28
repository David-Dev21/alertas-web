import { useState, useEffect, useCallback } from 'react';
import { solicitudesCancelacionService } from '@/services/solicitudes-cancelacion/solicitudesCancelacionService';
import {
  SolicitudCancelacion,
  RespuestaSolicitudesCancelacion,
  ParametrosConsultaSolicitudesCancelacion,
} from '@/types/solicitudes-cancelacion/SolicitudCancelacion';

export interface EstadoSolicitudesCancelacion {
  solicitudes: SolicitudCancelacion[];
  paginacion: {
    paginaActual: number;
    totalPaginas: number;
    totalElementos: number;
    elementosPorPagina: number;
  };
  cargando: boolean;
  error: string | null;
}

export function useSolicitudesCancelacion(parametrosIniciales: ParametrosConsultaSolicitudesCancelacion = {}) {
  const [estado, setEstado] = useState<EstadoSolicitudesCancelacion>({
    solicitudes: [],
    paginacion: {
      paginaActual: 1,
      totalPaginas: 0,
      totalElementos: 0,
      elementosPorPagina: 10,
    },
    cargando: true,
    error: null,
  });

  const [parametros, setParametros] = useState<ParametrosConsultaSolicitudesCancelacion>(parametrosIniciales);

  // Función para cargar solicitudes
  const cargarSolicitudes = useCallback(
    async (nuevosParametros?: ParametrosConsultaSolicitudesCancelacion, limpiarFiltros: boolean = false) => {
      try {
        setEstado((previo) => ({ ...previo, cargando: true, error: null }));

        const parametrosFinales = limpiarFiltros ? nuevosParametros || {} : { ...parametros, ...nuevosParametros };
        const respuesta = await solicitudesCancelacionService.obtenerTodas(parametrosFinales);

        setEstado((previo) => ({
          ...previo,
          solicitudes: respuesta.solicitudes,
          paginacion: respuesta.paginacion,
          cargando: false,
        }));

        if (nuevosParametros && !limpiarFiltros) {
          setParametros(parametrosFinales);
        } else if (limpiarFiltros) {
          setParametros(parametrosFinales);
        }
      } catch (error) {
        console.error('Error al cargar solicitudes de cancelación:', error);
        setEstado((previo) => ({
          ...previo,
          error: error instanceof Error ? error.message : 'Error desconocido',
          cargando: false,
        }));
      }
    },
    [parametros],
  );

  // Función para ir a una página específica
  const irAPagina = useCallback(
    (pagina: number) => {
      cargarSolicitudes({ pagina });
    },
    [cargarSolicitudes],
  );

  // Función para cambiar el límite de elementos por página
  const cambiarLimite = useCallback(
    (limite: number) => {
      cargarSolicitudes({ limite, pagina: 1 });
    },
    [cargarSolicitudes],
  );

  // Función para buscar
  const buscar = useCallback(
    (busqueda: string) => {
      cargarSolicitudes({ busqueda, pagina: 1 });
    },
    [cargarSolicitudes],
  );

  // Función para filtrar por estado
  const filtrarPorEstado = useCallback(
    (estado: string) => {
      if (estado === 'TODOS' || !estado) {
        // Limpiar todos los filtros y recargar desde cero
        setParametros({});
        cargarSolicitudes({ pagina: 1 }, true);
      } else {
        const nuevosParametros: ParametrosConsultaSolicitudesCancelacion = {
          ...parametros,
          estado: estado as 'PENDIENTE' | 'APROBADA' | 'RECHAZADA',
          pagina: 1,
        };
        cargarSolicitudes(nuevosParametros);
      }
    },
    [cargarSolicitudes, parametros],
  );

  // Función para actualizar estado de solicitud
  const actualizarEstadoSolicitud = useCallback(
    async (
      id: string,
      datos: {
        usuarioAdmin: string;
        estadoSolicitud: 'APROBADA' | 'RECHAZADA';
        motivoCancelacion: string;
      },
    ) => {
      try {
        await solicitudesCancelacionService.actualizarEstado(id, datos);
        // Recargar las solicitudes después de actualizar
        await cargarSolicitudes();
      } catch (error) {
        console.error('Error al actualizar estado de solicitud:', error);
        throw error;
      }
    },
    [cargarSolicitudes],
  );

  // Función para refrescar los datos
  const refrescar = useCallback(() => {
    cargarSolicitudes();
  }, [cargarSolicitudes]);

  // Cargar datos iniciales
  useEffect(() => {
    cargarSolicitudes();
  }, []);

  return {
    ...estado,
    irAPagina,
    cambiarLimite,
    buscar,
    filtrarPorEstado,
    actualizarEstadoSolicitud,
    refrescar,
  };
}
