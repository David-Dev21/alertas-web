"use client";

import { TablaUsuariosWeb } from "./tabla-usuarios-web";
import { crearColumnasUsuariosWeb } from "./columnas-usuarios-web";
import { useUsuariosWeb } from "@/hooks/usuarios/useUsuariosWeb";

export default function PaginaPersonalMonitoreo() {
  const { usuarios, paginacion, cargando, error, refrescar, irAPagina, cambiarLimite, buscar } = useUsuariosWeb();

  const columnas = crearColumnasUsuariosWeb();

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
          <h2 className="text-2xl font-bold tracking-tight">Personal de Monitoreo</h2>
          <p className="text-muted-foreground">Gestiona la información del personal de monitoreo en el sistema</p>
        </div>
      </div>

      {error && <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">Error: {error}</div>}

      <TablaUsuariosWeb
        datos={usuarios}
        columnas={columnas}
        cargando={cargando}
        paginacion={paginacion}
        onPaginaAnterior={manejarPaginaAnterior}
        onPaginaSiguiente={manejarPaginaSiguiente}
        onCambiarLimite={cambiarLimite}
        onBuscar={buscar}
        onRefrescar={refrescar}
      />
    </div>
  );
}
