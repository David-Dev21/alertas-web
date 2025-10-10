"use client";

import { useMemo, useState, useEffect } from "react";
import { useAlertasActivas } from "@/hooks/alertas/useAlertasActivas";
import { Button } from "@/components/ui/button";
import { MapaAlertasActivas } from "./MapaAlertasActivas";
import { ListaAlertasLateral } from "./ListaAlertasLateral";
import { Loading } from "@/components/EstadoCarga";
import { ErrorEstado } from "@/components/ErrorEstado";
import { EstadoAlerta } from "@/types/alertas/Alerta";
import { obtenerTextoEstado } from "@/types/alertas/Alerta";
import { useAlertaStore } from "@/stores/alertas/alertaStore";
import { FiltrosUbicacion } from "@/components/FiltrosUbicacion";

function obtenerClasesBotonEstado(estado: EstadoAlerta, activo: boolean): string {
  if (!activo) {
    // Cuando no está seleccionado, usar estilos neutros
    return "bg-gray-100 border-gray-300 hover:bg-opacity-50";
  }

  // Solo cuando está activo, aplicar colores específicos del estado
  const estadoStr = String(estado);
  const coloresBase = {
    PENDIENTE: "bg-red-500 text-white border-red-500 shadow-sm hover:bg-red-700",
    ASIGNADA: "bg-orange-500 text-white border-orange-500 shadow-sm hover:bg-orange-700",
    EN_ATENCION: "bg-yellow-500 text-white border-yellow-500 shadow-sm hover:bg-yellow-700",
  } as const;

  return coloresBase[estadoStr as keyof typeof coloresBase] || "bg-gray-500 text-white border-gray-500";
}

export function PantallaAlertasActivas() {
  const [estadosSeleccionados, setEstadosSeleccionados] = useState<Set<EstadoAlerta>>(new Set());
  const [resetearUbicacion, setResetearUbicacion] = useState(false);
  const [filtros, setFiltros] = useState({
    idDepartamento: undefined as number | undefined,
    idProvincia: undefined as number | undefined,
    idMunicipio: undefined as number | undefined,
  });

  const { alertas, loading, error, refetch } = useAlertasActivas(filtros);
  const { alertasPendientes } = useAlertaStore(); // Para re-renderizar cuando llegue nueva alerta

  // Refrescar datos cuando cambien los filtros de ubicación
  useEffect(() => {
    refetch();
  }, [filtros.idDepartamento, filtros.idProvincia, filtros.idMunicipio, refetch]);

  const alertasArray = Array.isArray(alertas) ? alertas : [];

  // Solo los 3 estados activos
  const estadosActivos: EstadoAlerta[] = [EstadoAlerta.PENDIENTE, EstadoAlerta.ASIGNADA, EstadoAlerta.EN_ATENCION];

  const alertasFiltradas = useMemo(() => {
    let alertasFiltradas = alertasArray;

    // Filtrar por estados seleccionados (si hay alguno seleccionado)
    if (estadosSeleccionados.size > 0) {
      alertasFiltradas = alertasFiltradas.filter((alerta) => estadosSeleccionados.has(alerta.estadoAlerta as EstadoAlerta));
    }

    return alertasFiltradas;
  }, [alertasArray, estadosSeleccionados, alertasPendientes]); // Agregado alertasPendientes

  const toggleEstadoFiltro = (estado: EstadoAlerta) => {
    setEstadosSeleccionados((prev) => {
      const nuevosEstados = new Set(prev);
      if (nuevosEstados.has(estado)) {
        nuevosEstados.delete(estado);
      } else {
        nuevosEstados.add(estado);
      }
      return nuevosEstados;
    });
  };

  const limpiarFiltros = () => {
    setEstadosSeleccionados(new Set());
    setFiltros({
      idDepartamento: undefined,
      idProvincia: undefined,
      idMunicipio: undefined,
    });
    // Resetear filtros de ubicación
    setResetearUbicacion(true);
    // Inmediatamente después, volver a false para permitir futuros reseteos
    setTimeout(() => setResetearUbicacion(false), 100);
  };

  // Verificar si hay filtros activos
  const hayFiltrosActivos =
    estadosSeleccionados.size > 0 || filtros.idDepartamento !== undefined || filtros.idProvincia !== undefined || filtros.idMunicipio !== undefined;

  const manejarCambioUbicacion = (ubicacion: { idDepartamento?: number | null; idProvincia?: number | null; idMunicipio?: number | null }) => {
    setFiltros({
      idDepartamento: ubicacion.idDepartamento || undefined,
      idProvincia: ubicacion.idProvincia || undefined,
      idMunicipio: ubicacion.idMunicipio || undefined,
    });
  };

  if (loading) {
    return <Loading mensaje="Cargando alertas activas..." />;
  }

  if (error) {
    return <ErrorEstado mensaje={error} onReintentar={refetch} enlaceVolver="/dashboard" />;
  }

  return (
    <div className="flex flex-col h-full gap-4">
      <div className="flex flex-wrap items-start gap-6 p-2 bg-muted/30 rounded-lg border flex-shrink-0">
        {/* Filtros por estado */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-muted-foreground">Estado:</label>
          <div className="flex items-center gap-2">
            {estadosActivos.map((estado) => {
              const seleccionado = estadosSeleccionados.has(estado);
              return (
                <Button
                  key={estado}
                  size="sm"
                  variant={seleccionado ? "secondary" : "outline"}
                  onClick={() => toggleEstadoFiltro(estado)}
                  className={`transition-all duration-200 h-9 ${obtenerClasesBotonEstado(estado, seleccionado)}`}
                >
                  {obtenerTextoEstado(estado)}
                </Button>
              );
            })}
          </div>
        </div>

        {/* Filtros de ubicación */}
        <div>
          <FiltrosUbicacion
            onCambioUbicacion={manejarCambioUbicacion}
            deshabilitado={loading}
            resetear={resetearUbicacion}
            valoresIniciales={{
              departamento: filtros.idDepartamento,
              provincia: filtros.idProvincia,
              municipio: filtros.idMunicipio,
            }}
          />
        </div>

        {/* Botón limpiar filtros - solo aparece cuando hay filtros activos */}
        {hayFiltrosActivos && (
          <div className="flex flex-col gap-1">
            <div className="h-[16px]"></div>
            <Button onClick={limpiarFiltros} variant="outline" size="sm" className="h-8">
              Limpiar filtros
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 flex-1 min-h-0">
        {/* Panel izquierdo - Solo el mapa */}
        <div className="lg:col-span-2 h-full min-h-0">
          {/* El mapa muestra las alertas filtradas */}
          <MapaAlertasActivas alertas={alertasFiltradas} />
        </div>

        {/* Panel derecho - Lista de alertas */}
        <div className="h-full min-h-0">
          <ListaAlertasLateral alertas={alertasFiltradas} />
        </div>
      </div>
    </div>
  );
}
