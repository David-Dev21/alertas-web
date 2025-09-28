import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, User, AlertTriangle } from 'lucide-react';
import { Evento } from '@/types/alertas/Alerta';

interface BitacoraEventosProps {
  eventos: Evento[];
}

export function BitacoraEventos({ eventos }: BitacoraEventosProps) {
  const obtenerIconoEvento = (tipoEvento: string) => {
    switch (tipoEvento) {
      case 'ALERTA_RECIBIDA':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'ALERTA_CERRADA':
        return <Clock className="w-4 h-4 text-green-500" />;
      case 'FUNCIONARIO_ASIGNADO':
        return <User className="w-4 h-4 text-blue-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const obtenerTituloEvento = (tipoEvento: string) => {
    switch (tipoEvento) {
      case 'ALERTA_RECIBIDA':
        return 'Alerta Recibida';
      case 'ALERTA_CERRADA':
        return 'Alerta Cerrada';
      case 'FUNCIONARIO_ASIGNADO':
        return 'Funcionario Asignado';
      default:
        return tipoEvento.replace('_', ' ');
    }
  };

  const obtenerColorBadge = (tipoEvento: string) => {
    switch (tipoEvento) {
      case 'ALERTA_RECIBIDA':
        return 'destructive';
      case 'ALERTA_CERRADA':
        return 'default';
      case 'FUNCIONARIO_ASIGNADO':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  if (!eventos || eventos.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Bitácora de Eventos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-4">No hay eventos registrados para esta alerta</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="w-5 h-5" />
          Bitácora de Eventos ({eventos.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {eventos.map((evento) => (
            <div key={evento.id} className="flex items-start gap-3 p-3 rounded-lg border">
              <div className="flex-shrink-0 mt-0.5">{obtenerIconoEvento(evento.tipoEvento)}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-sm">{obtenerTituloEvento(evento.tipoEvento)}</h4>
                  {/* <Badge variant={obtenerColorBadge(evento.tipoEvento)} className="text-xs">
                    {evento.tipoEvento}
                  </Badge> */}
                  <p className="text-xs text-muted-foreground mb-1">
                    {new Date(evento.fechaHora).toLocaleDateString('es-BO', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    })}
                    {' - '}
                    {new Date(evento.fechaHora).toLocaleTimeString('es-BO', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
                {evento.funcionarioExterno && <p className="text-xs text-muted-foreground">Funcionario: {evento.funcionarioExterno}</p>}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
