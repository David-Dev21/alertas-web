"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { SolicitudCancelacion } from "@/types/solicitudes-cancelacion/SolicitudCancelacion";
import { useAutenticacionStore } from "@/stores/autenticacion/autenticacionStore";
import { CheckCircle, XCircle } from "lucide-react";

interface ModalProcesarSolicitudProps {
  solicitud: SolicitudCancelacion | null;
  abierto: boolean;
  onCerrar: () => void;
  onConfirmar: (
    id: string,
    datos: {
      usuarioAdmin: string;
      estadoSolicitud: "APROBADA" | "RECHAZADA";
      motivoCancelacion: string;
    }
  ) => Promise<void>;
  cargando: boolean;
}

export function ModalProcesarSolicitud({ solicitud, abierto, onCerrar, onConfirmar, cargando }: ModalProcesarSolicitudProps) {
  const { datosUsuario } = useAutenticacionStore();
  const [estadoSolicitud, setEstadoSolicitud] = useState<"APROBADA" | "RECHAZADA">("APROBADA");
  const [motivoCancelacion, setMotivoCancelacion] = useState("");

  const manejarConfirmar = async () => {
    if (!solicitud || !motivoCancelacion.trim() || !datosUsuario?.idUsuario) {
      return;
    }

    try {
      await onConfirmar(solicitud.id, {
        usuarioAdmin: datosUsuario.idUsuario,
        estadoSolicitud,
        motivoCancelacion: motivoCancelacion.trim(),
      });

      // Limpiar formulario
      setEstadoSolicitud("APROBADA");
      setMotivoCancelacion("");
      onCerrar();
    } catch (error) {
      console.error("Error al procesar solicitud:", error);
    }
  };

  const manejarCerrar = () => {
    // Limpiar formulario al cerrar
    setEstadoSolicitud("APROBADA");
    setMotivoCancelacion("");
    onCerrar();
  };

  return (
    <Dialog open={abierto} onOpenChange={manejarCerrar}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {estadoSolicitud === "APROBADA" ? "Aprobar" : "Rechazar"} Solicitud de Cancelación
          </DialogTitle>
          <DialogDescription>
            {solicitud && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p>
                    <strong>Víctima:</strong> {solicitud.victima.nombres} {solicitud.victima.apellidos}
                  </p>
                  <Badge variant={solicitud.estadoSolicitud === "PENDIENTE" ? "secondary" : "outline"}>{solicitud.estadoSolicitud}</Badge>
                </div>
                <p>
                  <strong>Celular:</strong> {solicitud.victima.celular}
                </p>
                <p>
                  <strong>Fecha de Solicitud:</strong> {new Date(solicitud.fechaSolicitud).toLocaleDateString("es-ES")}
                </p>
              </div>
            )}
          </DialogDescription>
        </DialogHeader>

        <Separator />

        <div className="space-y-4 py-4">
          <div className="flex items-center gap-4">
            <Label htmlFor="estado" className="w-24 text-right">
              Acción
            </Label>
            <div className="flex-1">
              <Select value={estadoSolicitud} onValueChange={(value: "APROBADA" | "RECHAZADA") => setEstadoSolicitud(value)} disabled={cargando}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="APROBADA">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Aprobar
                    </div>
                  </SelectItem>
                  <SelectItem value="RECHAZADA">
                    <div className="flex items-center gap-2">
                      <XCircle className="h-4 w-4 text-red-500" />
                      Rechazar
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <Label htmlFor="motivo" className="w-24 text-right pt-2">
              Motivo
            </Label>
            <div className="flex-1">
              <Textarea
                id="motivo"
                value={motivoCancelacion}
                onChange={(e) => setMotivoCancelacion(e.target.value)}
                placeholder="Ingrese el motivo de la decisión..."
                className="min-h-[100px]"
                disabled={cargando}
              />
            </div>
          </div>
        </div>

        <Separator />

        <DialogFooter className="flex gap-2">
          <Button type="button" variant="outline" onClick={manejarCerrar} disabled={cargando}>
            <XCircle className="h-4 w-4 mr-2" />
            Cancelar
          </Button>
          <Button type="button" onClick={manejarConfirmar} disabled={cargando || !motivoCancelacion.trim() || !datosUsuario?.idUsuario}>
            {cargando ? (
              "Procesando..."
            ) : (
              <>
                {estadoSolicitud === "APROBADA" ? <CheckCircle className="h-4 w-4 mr-2" /> : <XCircle className="h-4 w-4 mr-2" />}
                Confirmar
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
