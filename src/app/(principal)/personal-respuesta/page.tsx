"use client";

import { TablaPersonal } from "./tabla-personal";
import { crearColumnasPersonal } from "./columnas-personal";
import { ModalEditarPersonal } from "./ModalEditarPersonal";
import { usePersonal } from "@/hooks/personal/usePersonal";
import { useState } from "react";
import { Personal } from "@/services/personalService";

export default function PaginaPersonalRespuesta() {
  const [departamentoFiltro, setDepartamentoFiltro] = useState<string>("TODOS");
  const [modalEditarAbierto, setModalEditarAbierto] = useState(false);
  const [personalAEditar, setPersonalAEditar] = useState<Personal | null>(null);
  const { personal, paginacion, cargando, error, refrescar, irAPagina, cambiarLimite, buscar, filtrarPorDepartamento } = usePersonal();

  const manejarEditar = (personal: Personal) => {
    setPersonalAEditar(personal);
    setModalEditarAbierto(true);
  };

  const manejarActualizado = () => {
    refrescar();
  };

  const columnas = crearColumnasPersonal(manejarEditar);

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

  const manejarFiltrarDepartamento = (departamento: string) => {
    setDepartamentoFiltro(departamento);
    filtrarPorDepartamento(departamento);
  };

  return (
    <div className="h-full flex-1 flex-col space-y-8 md:flex">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Personal de Respuesta</h2>
          <p className="text-muted-foreground">Gestiona la información del personal de respuesta en el sistema</p>
        </div>
      </div>

      {error && <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">Error: {error}</div>}

      <TablaPersonal
        datos={personal}
        columnas={columnas}
        cargando={cargando}
        paginacion={paginacion}
        onPaginaAnterior={manejarPaginaAnterior}
        onPaginaSiguiente={manejarPaginaSiguiente}
        onIrAPagina={irAPagina}
        onCambiarLimite={cambiarLimite}
        onBuscar={buscar}
        onRefrescar={refrescar}
        onFiltrarDepartamento={manejarFiltrarDepartamento}
        departamentoFiltro={departamentoFiltro}
      />

      <ModalEditarPersonal
        personal={personalAEditar}
        abierto={modalEditarAbierto}
        onCerrar={() => setModalEditarAbierto(false)}
        onActualizado={manejarActualizado}
      />
    </div>
  );
}
