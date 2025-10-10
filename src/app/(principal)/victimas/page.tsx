"use client";

import { TablaVictimas } from "./tabla-victimas";
import { columnasVictimas } from "./columnas-victimas";
import { useVictimas } from "@/hooks/victimas/useVictimas";

export default function PaginaVictimas() {
  const { victimas, paginacion, cargando, error, refrescar, irAPagina, cambiarLimite, buscar } = useVictimas();

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
          <h2 className="text-2xl font-bold tracking-tight">Víctimas con Botón de Pánico</h2>
          <p className="text-muted-foreground">Gestiona la información de las víctimas registradas en el sistema</p>
        </div>
      </div>

      {error && <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">Error: {error}</div>}

      <TablaVictimas
        datos={victimas}
        columnas={columnasVictimas}
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
