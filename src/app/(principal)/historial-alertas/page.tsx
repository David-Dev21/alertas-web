'use client';

import { TablaHistorial } from './tabla-historial';
import { columnasHistorial } from './columnas-historial';
import useHistorialAlertas from '@/hooks/alertas/useHistorialAlertas';

export default function HistorialAlertasPage() {
  const { alertas, paginacion, cargando, error, refrescar, irAPagina, cambiarLimite, buscar } = useHistorialAlertas();

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

  return (
    <div className="h-full flex-1 flex-col space-y-8 md:flex p-4">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Historial de Alertas</h2>
          <p className="text-muted-foreground">Se muestran todas las alertas que ya han sido resueltas, canceladas o haya sido falsas alarmas</p>
        </div>
      </div>

      {error && <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">Error: {error}</div>}

      <TablaHistorial
        datos={alertas}
        columnas={columnasHistorial}
        cargando={cargando}
        paginacion={paginacion}
        onPaginaAnterior={manejarPaginaAnterior}
        onPaginaSiguiente={manejarPaginaSiguiente}
        onIrAPagina={irAPagina}
        onCambiarLimite={cambiarLimite}
        onBuscar={buscar}
        onRefrescar={refrescar}
      />
    </div>
  );
}
