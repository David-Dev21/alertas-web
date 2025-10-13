"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertaBadge } from "@/components/AlertaBadge";
import { CheckCircle, User, Calendar, AlertTriangle } from "lucide-react";
import type { CierreAlerta as CierreAlertaType } from "@/types/alertas/Alerta";

interface CierreAlertaExtended extends CierreAlertaType {
  idUsuarioWeb?: string;
  grado?: string;
  nombreCompleto?: string;
  agresores?: Array<{
    idAgresor: string;
    cedulaIdentidad: string;
    nombreCompleto: string;
    parentesco: string;
  }>;
}

interface CierreAlertaProps {
  cierre: CierreAlertaExtended;
  estadoAlerta: string;
}

export function CierreAlerta({ cierre, estadoAlerta }: CierreAlertaProps) {
  if (!cierre) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle className="size-5" />
          Información del Cierre
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3">
          <div className="flex items-center gap-3">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Fecha y hora</p>
              <p className="text-sm text-muted-foreground">
                {new Date(cierre.fechaHora).toLocaleDateString("es-BO")}
                {" - "}
                {new Date(cierre.fechaHora).toLocaleTimeString("es-BO", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <User className="w-4 h-4 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Responsable</p>
              <p className="text-sm text-muted-foreground">
                {cierre.grado ? `${cierre.grado} ` : ""}
                {cierre.nombreCompleto || cierre.usuarioAdmin || cierre.idUsuarioWeb}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 border-t border-b">
            <div className="mt-2">
              <p className="text-sm font-medium">Estado de la víctima</p>
              <p className="text-sm text-muted-foreground pb-1">{cierre.estadoVictima}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div>
              <p className="text-sm font-medium">Motivo del cierre</p>
              <Badge variant="secondary" className="mt-1">
                {cierre.motivoCierre === "RESUELTA"
                  ? "Resuelta"
                  : cierre.motivoCierre === "FALSA_ALERTA"
                  ? "Falsa Alarma"
                  : cierre.motivoCierre === "CANCELADA"
                  ? "Cancelada"
                  : cierre.motivoCierre}
              </Badge>
            </div>
          </div>
        </div>

        {cierre.observaciones && (
          <div className="pt-4 border-t">
            <p className="text-sm font-medium mb-2">Observaciones</p>
            <p className="text-sm text-muted-foreground">{cierre.observaciones}</p>
          </div>
        )}

        {cierre.agresores && cierre.agresores.length > 0 && (
          <div className="pt-4 border-t">
            <p className="text-sm font-medium mb-3">
              Información del{cierre.agresores.length > 1 ? "s" : ""} agresor{cierre.agresores.length > 1 ? "es" : ""}
            </p>
            <div className="space-y-3">
              {cierre.agresores.map((agresor, index) => (
                <div key={agresor.idAgresor} className="p-3 bg-muted/20 rounded-2xl border">
                  {cierre.agresores && cierre.agresores.length > 1 && <p className="text-sm font-medium mb-2">Agresor {index + 1}</p>}
                  <div className="space-y-1">
                    <p className="text-sm">
                      <strong>Cédula:</strong> {agresor.cedulaIdentidad}
                    </p>
                    <p className="text-sm">
                      <strong>Nombre:</strong> {agresor.nombreCompleto}
                    </p>
                    <p className="text-sm">
                      <strong>Parentesco:</strong> {agresor.parentesco}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
