"use client";

import React from "react";
import { Alerta } from "@/services/alertas/alertasService";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Clock, MapPin, UserRound } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAlertaSeleccionStore } from "@/stores/alertas/alertaSeleccionStore";
import { AlertaBadge } from "@/components/AlertaBadge";
import { useAlertaStore } from "@/stores/alertas/alertaStore";

interface ListaAlertasLateralProps {
  alertas: Alerta[];
}

function calcularTiempoTranscurrido(fechaHora: string): string {
  const now = new Date();
  const fecha = new Date(fechaHora);
  const diff = Math.abs(now.getTime() - fecha.getTime());

  const minutos = Math.floor(diff / (1000 * 60));
  const horas = Math.floor(minutos / 60);

  if (horas > 0) return `Hace ${horas}h ${minutos % 60}min`;
  return `Hace ${minutos} min`;
}

function obtenerDatosUbicacion(alerta: Alerta) {
  const ubicaciones: string[] = [];

  if (alerta.municipio) ubicaciones.push(alerta.municipio);
  if (alerta.provincia) ubicaciones.push(alerta.provincia);
  if (alerta.departamento) ubicaciones.push(alerta.departamento);

  return ubicaciones;
}

function obtenerColorBarraLateral(estado: string): string {
  const colores = {
    PENDIENTE: "bg-red-500",
    ASIGNADA: "bg-orange-500",
    EN_ATENCION: "bg-yellow-500",
  } as const;

  return colores[estado as keyof typeof colores] || "bg-gray-500";
}

export function ListaAlertasLateral({ alertas }: ListaAlertasLateralProps) {
  const { alertaDestacada, destacarAlerta, limpiarDestacado } = useAlertaSeleccionStore();
  const { alertasPendientes, removerAlertaPendiente } = useAlertaStore();

  const alertasArray = Array.isArray(alertas) ? alertas : [];

  const manejarClickCard = (alertaId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (alertaDestacada === alertaId) limpiarDestacado();
    else destacarAlerta(alertaId);
  };

  return (
    <div className="h-full bg-card rounded-lg border flex flex-col">
      {alertasArray.length === 0 ? (
        <div className="h-full flex items-center justify-center p-8">
          <p className="text-sm text-muted-foreground">No hay alertas activas</p>
        </div>
      ) : (
        <ScrollArea className="h-full">
          <div className="p-2">
            <ul className="flex flex-col gap-3">
              {alertasArray.map((alerta) => {
                const estaDestacada = alertaDestacada === alerta.id;

                return (
                  <li
                    key={alerta.id}
                    className={`group relative overflow-hidden border border-border/40 rounded-lg transition-all duration-200 cursor-pointer ${
                      estaDestacada
                        ? "border-primary/60 bg-primary/5 shadow-md ring-1 ring-primary/20"
                        : "hover:border-border hover:shadow-sm hover:bg-muted/30"
                    }`}
                    onClick={(e) => manejarClickCard(alerta.id, e)}
                  >
                    {/* Barra lateral de estado */}
                    <div
                      className={`absolute left-0 top-0 w-1 h-full transition-all duration-200 ${obtenerColorBarraLateral(alerta.estadoAlerta)}`}
                    />

                    <div className="p-4 pl-5">
                      {/* Header con estado y tiempo */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <AlertaBadge estado={alerta.estadoAlerta} tamaño="sm" />
                          <span className="text-xs font-medium text-muted-foreground">{alerta.origen || "Sin origen"}</span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded-full">
                          <Clock className="w-3 h-3" />
                          <span>{calcularTiempoTranscurrido(alerta.fechaHora)}</span>
                        </div>
                      </div>

                      {/* Información principal */}
                      <div className="flex justify-between items-center">
                        {/* Víctima - información principal */}
                        <div className="flex-col space-y-1">
                          <div className="flex items-center ">
                            <UserRound />
                            <span className="font-semibold text-foreground leading-tight ml-2">
                              {alerta.victima?.nombres && alerta.victima?.apellidos
                                ? `${alerta.victima.nombres} ${alerta.victima.apellidos}`
                                : "Víctima desconocida"}
                            </span>
                          </div>
                          {/* Ubicación */}
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <MapPin className="size-6 text-muted-foreground/60 mt-0.5" />
                            <div className="flex flex-col">
                              {obtenerDatosUbicacion(alerta).length > 0 ? (
                                obtenerDatosUbicacion(alerta).map((ubicacion, index) => (
                                  <span key={index} className="leading-tight text-xs">
                                    {ubicacion}
                                  </span>
                                ))
                              ) : (
                                <span className="text-xs">Sin ubicación</span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Botón de acción - solo visible en hover o cuando está destacada */}
                        <Button
                          asChild
                          size="sm"
                          variant="outline"
                          className={`ml-2 transition-opacity duration-200 ${estaDestacada ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}
                        >
                          <Link
                            href={`/alertas-activas/${alerta.id}`}
                            onClick={() => {
                              // Solo remover del store local si es alerta PENDIENTE
                              if (alerta.estadoAlerta === "PENDIENTE") {
                                const existeEnPendientes = alertasPendientes.some((a) => a.idAlerta === alerta.id);
                                if (existeEnPendientes) {
                                  removerAlertaPendiente(alerta.id);
                                }
                              }
                            }}
                          >
                            Detalles
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </ScrollArea>
      )}
    </div>
  );
}
