import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, User, AlertTriangle, Phone, Heart, X, Ban } from "lucide-react";
import { Evento } from "@/services/alertas/alertasService";
import { TipoEvento } from "@/types/enums";

interface BitacoraEventosProps {
  eventos: Evento[];
}

export function BitacoraEventos({ eventos }: BitacoraEventosProps) {
  const obtenerIconoEvento = (tipoEvento: TipoEvento | string) => {
    switch (tipoEvento) {
      case TipoEvento.ALERTA_RECIBIDA:
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case TipoEvento.ALERTA_ASIGNADA:
        return <User className="w-4 h-4 text-blue-500" />;
      case TipoEvento.CONTACTO_FAMILIARES:
        return <Phone className="w-4 h-4 text-green-500" />;
      case TipoEvento.ATENCION_VICTIMA:
        return <Heart className="w-4 h-4 text-purple-500" />;
      case TipoEvento.ALERTA_CERRADA:
        return <Clock className="w-4 h-4 text-green-500" />;
      case TipoEvento.ALERTA_CANCELADA:
        return <X className="w-4 h-4 text-orange-500" />;
      case TipoEvento.FALSA_ALERTA:
        return <Ban className="w-4 h-4 text-gray-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const obtenerTituloEvento = (tipoEvento: TipoEvento | string) => {
    switch (tipoEvento) {
      case TipoEvento.ALERTA_RECIBIDA:
        return "Esta alerta de emergencia llegó al sistema";
      case TipoEvento.ALERTA_ASIGNADA:
        return "Se asigno personal policial para atender esta alerta";
      case TipoEvento.CONTACTO_FAMILIARES:
        return "Se contactó a la familia de la víctima";
      case TipoEvento.ATENCION_VICTIMA:
        return "Se tomo contacto con víctima en el lugar";
      case TipoEvento.ALERTA_CERRADA:
        return "Esta alerta de emergencia se resolvió por completo";
      case TipoEvento.ALERTA_CANCELADA:
        return "Esta alerta fue cancelada";
      case TipoEvento.FALSA_ALERTA:
        return "Esta alerta resultó ser una falsa alarma";
      default:
        return tipoEvento.toLowerCase().replace("_", " ");
    }
  };

  if (!eventos || eventos.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-muted-foreground">
            <Clock className="w-5 h-5" />
            Historial de Eventos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No hay eventos registrados</p>
            <p className="text-xs">Los eventos aparecerán aquí</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="w-5 h-5" />
          Historial de Eventos ({eventos.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {eventos.map((evento) => (
            <div key={evento.id} className="flex items-center gap-3 p-3 rounded-lg border">
              <div className="flex-shrink-0">{obtenerIconoEvento(evento.tipoEvento)}</div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-sm">{obtenerTituloEvento(evento.tipoEvento)}</h4>
              </div>
              <p className="text-xs text-muted-foreground flex-shrink-0">
                {new Date(evento.fechaHora).toLocaleDateString("es-ES", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })}
                {" • "}
                {new Date(evento.fechaHora).toLocaleTimeString("es-ES", {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: false,
                })}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
