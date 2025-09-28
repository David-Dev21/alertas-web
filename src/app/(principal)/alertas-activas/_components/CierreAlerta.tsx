'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertaBadge } from '@/components/AlertaBadge';
import { CheckCircle, User, Calendar, AlertTriangle } from 'lucide-react';

interface CierreAlerta {
  usuarioAdmin: string;
  fechaHora: string;
  estadoVictima: string;
  idAgresor?: string | null;
  motivoCierre: string;
  observaciones: string;
}

interface CierreAlertaProps {
  cierre: CierreAlerta;
  estadoAlerta: string;
}

export function CierreAlerta({ cierre, estadoAlerta }: CierreAlertaProps) {
  if (!cierre) {
    return null; // No mostrar nada si no hay información de cierre
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle className="size-5" />
          Cierre de Alerta
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm">
              {new Date(cierre.fechaHora).toLocaleDateString('es-BO', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
              })}
              {' - '}
              {new Date(cierre.fechaHora).toLocaleTimeString('es-BO', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm">Cerrado por: {cierre.usuarioAdmin}</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Estado Víctima:</span>
            <span className="text-sm">{cierre.estadoVictima}</span>
          </div>
        </div>

        {cierre.observaciones && (
          <div className="pt-3 border-t">
            <h5 className="text-sm font-medium mb-2">Observaciones:</h5>
            <p className="text-sm text-muted-foreground">{cierre.observaciones}</p>
          </div>
        )}

        {/* {cierre.idAgresor && (
          <div className="pt-3 border-t">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-500" />
              <span className="text-sm font-medium">ID Agresor:</span>
              <span className="text-sm font-mono">{cierre.idAgresor}</span>
            </div>
          </div>
        )} */}

        <div className="pt-3 border-t">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Estado Actual:</span>
            <AlertaBadge estado={estadoAlerta} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
