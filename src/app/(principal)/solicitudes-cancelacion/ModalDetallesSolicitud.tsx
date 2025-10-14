"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { DatosDetalleSolicitudCancelacion } from "@/services/alertas/solicitudesCancelacionService";

function EstadoBadge({ estado }: { estado: DatosDetalleSolicitudCancelacion["estadoSolicitud"] }) {
  // Badge simple y legible
  const variante = estado === "APROBADA" ? "default" : estado === "RECHAZADA" ? "destructive" : "secondary";
  return (
    <Badge variant={variante} className="uppercase text-xs">
      {estado}
    </Badge>
  );
}

interface ModalDetallesSolicitudProps {
  abierto: boolean;
  onCerrar: () => void;
  detalle: DatosDetalleSolicitudCancelacion | null;
  cargando: boolean;
  error: string | null;
}

export function ModalDetallesSolicitud({ abierto, onCerrar, detalle, cargando, error }: ModalDetallesSolicitudProps) {
  return (
    <Dialog open={abierto} onOpenChange={onCerrar}>
      <DialogContent className="sm:max-w-[540px] p-6">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">Detalle de solicitud</DialogTitle>
        </DialogHeader>

        {cargando && (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        )}

        {error && <div className="text-center py-4 text-red-600 text-base">Error: {error}</div>}

        {detalle && !cargando && !error && (
          <div className="space-y-5 text-base">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Fecha</span>
              <span className="font-medium">{new Date(detalle.fechaSolicitud).toLocaleDateString("es-ES")}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Estado</span>
              <EstadoBadge estado={detalle.estadoSolicitud} />
            </div>

            <Separator />

            <div>
              <div className="text-sm text-muted-foreground">Usuario que aprobó</div>
              <div className="font-medium mt-1 text-base">{detalle.usuarioAprobador || "—"}</div>
            </div>

            <div>
              <div className="text-sm text-muted-foreground">Motivo</div>
              <div className="mt-1 text-base leading-relaxed">{detalle.motivoCancelacion || "—"}</div>
            </div>

            <Separator />

            <div>
              <div className="text-sm text-muted-foreground">Víctima</div>
              <div className="mt-2 space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Nombre</span>
                  <span className="font-medium text-base">
                    {detalle.victima.nombres} {detalle.victima.apellidos}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Celular</span>
                  <span className="font-medium text-base">{detalle.victima.celular}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Cédula</span>
                  <span className="font-medium text-base">{detalle.victima.cedulaIdentidad}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        <DialogFooter>
          <Button variant="ghost" onClick={onCerrar} className="text-sm">
            Cerrar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
