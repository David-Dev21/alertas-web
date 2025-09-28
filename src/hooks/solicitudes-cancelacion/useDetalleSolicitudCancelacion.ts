import { useState, useCallback } from 'react';
import { solicitudesCancelacionService, DetalleSolicitudCancelacion } from '@/services/solicitudes-cancelacion/solicitudesCancelacionService';

export interface EstadoDetalleSolicitud {
  detalle: DetalleSolicitudCancelacion | null;
  cargando: boolean;
  error: string | null;
  modalAbierto: boolean;
}

export function useDetalleSolicitudCancelacion() {
  const [estado, setEstado] = useState<EstadoDetalleSolicitud>({
    detalle: null,
    cargando: false,
    error: null,
    modalAbierto: false,
  });

  const abrirModal = useCallback(() => {
    setEstado((previo) => ({ ...previo, modalAbierto: true }));
  }, []);

  const cerrarModal = useCallback(() => {
    setEstado((previo) => ({
      ...previo,
      modalAbierto: false,
      detalle: null,
      error: null,
    }));
  }, []);

  const cargarDetalle = useCallback(async (id: string) => {
    try {
      setEstado((previo) => ({
        ...previo,
        cargando: true,
        error: null,
      }));

      const detalle = await solicitudesCancelacionService.obtenerDetalle(id);

      setEstado((previo) => ({
        ...previo,
        detalle,
        cargando: false,
      }));
    } catch (error) {
      console.error('Error al cargar detalle de solicitud:', error);
      setEstado((previo) => ({
        ...previo,
        error: error instanceof Error ? error.message : 'Error desconocido',
        cargando: false,
      }));
    }
  }, []);

  const verDetalles = useCallback(
    async (id: string) => {
      abrirModal();
      await cargarDetalle(id);
    },
    [abrirModal, cargarDetalle],
  );

  return {
    ...estado,
    abrirModal,
    cerrarModal,
    verDetalles,
  };
}
