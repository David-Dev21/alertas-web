"use client";

import { useState, useEffect } from "react";
import { useAlertaDetalle } from "@/hooks/alertas/useAlertasActivas";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { MapaAlertaDetalle } from "@/app/(principal)/alertas-activas/_components/MapaAlertaDetalle";
import { AlertaBadge } from "@/components/AlertaBadge";
import { DatosVictimas } from "@/app/(principal)/alertas-activas/_components/DatosVictimas";
import { FuncionariosAsignados } from "@/app/(principal)/alertas-activas/_components/FuncionariosAsignados";
import type { FuncionarioAsignado } from "@/app/(principal)/alertas-activas/_components/FuncionariosAsignados";
import { BitacoraEventos } from "@/app/(principal)/alertas-activas/_components/BitacoraEventos";
import { CierreAlerta } from "@/app/(principal)/alertas-activas/_components/CierreAlerta";
import { ErrorEstado } from "@/components/ErrorEstado";
import { Loading } from "@/components/EstadoCarga";

interface Props {
  idAlerta: string;
}

export function DetalleAlertaHistorial({ idAlerta }: Props) {
  const { alerta, loading, error, refetch } = useAlertaDetalle(idAlerta);

  if (loading) {
    return <Loading mensaje="Cargando detalle del historial..." />;
  }

  if (error) {
    return <ErrorEstado mensaje={error} onReintentar={refetch} enlaceVolver="/historial-alertas" />;
  }

  if (!alerta) {
    return <ErrorEstado mensaje="No se encontró la alerta solicitada" enlaceVolver="/historial-alertas" />;
  }

  return (
    <div>
      {/* Header mejorado */}
      <div className="mb-4 space-y-4">
        {/* Barra de navegación superior */}
        <div className="flex items-center justify-between">
          {/* Sin acciones de modificación para historial */}
          <div></div>

          <Button asChild variant="ghost" size="sm" className="hover:bg-muted/50">
            <Link href="/historial-alertas">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver al Historial
            </Link>
          </Button>
        </div>

        {/* Información principal de la alerta */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 px-4 py-2 bg-muted/30 rounded-lg border">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <h1 className="text-md font-bold text-foreground">
              {alerta.codigoCud ? `CUD: ${alerta.codigoCud}` : `Registro: ${alerta.codigoRegistro}`}
            </h1>

            <div className="flex items-center gap-2">
              <AlertaBadge estado={alerta.estadoAlerta} tamaño="sm" />
            </div>
          </div>

          {/* Metadatos de la alerta */}
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary" className="text-xs">
              <div className="flex flex-row items-start">
                <span className="text-xs text-muted-foreground mr-2">Activada:</span>
                <span className="font-medium">
                  {new Date(alerta.fechaHora).toLocaleDateString("es-BO", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                  {" • "}
                  {new Date(alerta.fechaHora).toLocaleTimeString("es-BO", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </Badge>
            <Badge variant={alerta.origen === "FELCV" ? "default" : "outline"} className="text-xs">
              Origen: {alerta.origen}
            </Badge>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Columna izquierda - Ubicación con Mapa */}
        <div className="lg:col-span-2 space-y-4">
          <MapaAlertaDetalle alerta={alerta} />

          {/* Funcionarios Asignados */}
          <FuncionariosAsignados
            atencion={
              alerta.atencion
                ? { ...alerta.atencion, atencionFuncionario: alerta.atencion.atencionFuncionario as unknown as FuncionarioAsignado[] }
                : undefined
            }
          />

          {/* Bitácora de Eventos */}
          <BitacoraEventos eventos={alerta.eventos || []} />
        </div>

        {/* Columna derecha - Datos de la Víctima y Cierre */}
        <div className="space-y-4">
          <DatosVictimas victima={alerta.victima} />

          {/* Mostrar cierre de alerta si existe */}
          {alerta.cierre && <CierreAlerta cierre={alerta.cierre} estadoAlerta={alerta.estadoAlerta} />}
        </div>
      </div>
    </div>
  );
}
