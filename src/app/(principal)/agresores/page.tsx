"use client";

import { TablaAgresores } from "./tabla-agresores";
import { columnasAgresores } from "./columnas-agresores";
import { useAgresores } from "@/hooks/agresores/useAgresores";

export default function PaginaAgresores() {
  const { agresores, paginacion, cargando, error, refrescar, irAPagina, cambiarLimite, buscar } = useAgresores();

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
    <div className="h-full flex-1 flex-col space-y-8 md:flex">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Agresores</h2>
          <p className="text-muted-foreground">Gestiona la información de los agresores registrados en el sistema</p>
        </div>
      </div>

      {error && <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">Error: {error}</div>}

      <TablaAgresores
        datos={agresores}
        columnas={columnasAgresores}
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
