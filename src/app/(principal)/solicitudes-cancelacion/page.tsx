'use client';

import { TablaSolicitudesCancelacion } from './tabla-solicitudes-cancelacion';
import { crearColumnasSolicitudesCancelacion } from './columnas-solicitudes-cancelacion';
import { ModalProcesarSolicitud } from './ModalProcesarSolicitud';
import { useSolicitudesCancelacion } from '@/hooks/solicitudes-cancelacion/useSolicitudesCancelacion';
import { useState } from 'react';
import { SolicitudCancelacion } from '@/types/solicitudes-cancelacion/SolicitudCancelacion';

export default function PaginaSolicitudesCancelacion() {
  const [estadoFiltro, setEstadoFiltro] = useState<string>('TODOS');
  const [solicitudSeleccionada, setSolicitudSeleccionada] = useState<SolicitudCancelacion | null>(null);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [cargandoAccion, setCargandoAccion] = useState(false);

  const { solicitudes, paginacion, cargando, error, refrescar, irAPagina, cambiarLimite, buscar, filtrarPorEstado, actualizarEstadoSolicitud } =
    useSolicitudesCancelacion();

  const manejarPaginaAnterior = () => {
    if (paginacion.paginaActual > 1) {
      irAPagina(paginacion.paginaActual - 1);
    }
  };

  const manejarPaginaSiguiente = () => {
    if (paginacion.paginaActual < paginacion.totalPaginas) {
      irAPagina(paginacion.paginaActual + 1);
    }
  };

  const manejarFiltrarEstado = (estado: string) => {
    setEstadoFiltro(estado);
    filtrarPorEstado(estado === 'TODOS' ? '' : estado);
  };

  const manejarAccionSolicitud = (solicitud: SolicitudCancelacion) => {
    setSolicitudSeleccionada(solicitud);
    setModalAbierto(true);
  };

  const manejarConfirmarAccion = async (
    id: string,
    datos: {
      usuarioAdmin: string;
      estadoSolicitud: 'APROBADA' | 'RECHAZADA';
      motivoCancelacion: string;
    },
  ) => {
    setCargandoAccion(true);
    try {
      await actualizarEstadoSolicitud(id, datos);
    } catch (error) {
      console.error('Error al procesar solicitud:', error);
      throw error;
    } finally {
      setCargandoAccion(false);
    }
  };

  const manejarCerrarModal = () => {
    setModalAbierto(false);
    setSolicitudSeleccionada(null);
  };

  const columnas = crearColumnasSolicitudesCancelacion(manejarAccionSolicitud);

  return (
    <div className="h-full flex-1 flex-col space-y-8 md:flex">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Solicitudes de Cancelación</h2>
          <p className="text-muted-foreground">Gestiona las solicitudes de cancelación de alertas en el sistema</p>
        </div>
      </div>

      {error && <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">Error: {error}</div>}

      <TablaSolicitudesCancelacion
        datos={solicitudes}
        columnas={columnas}
        cargando={cargando}
        paginacion={paginacion}
        onPaginaAnterior={manejarPaginaAnterior}
        onPaginaSiguiente={manejarPaginaSiguiente}
        onIrAPagina={irAPagina}
        onCambiarLimite={cambiarLimite}
        onBuscar={buscar}
        onRefrescar={refrescar}
        onFiltrarEstado={manejarFiltrarEstado}
        estadoFiltro={estadoFiltro}
      />

      <ModalProcesarSolicitud
        solicitud={solicitudSeleccionada}
        abierto={modalAbierto}
        onCerrar={manejarCerrarModal}
        onConfirmar={manejarConfirmarAccion}
        cargando={cargandoAccion}
      />
    </div>
  );
}
