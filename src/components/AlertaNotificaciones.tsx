'use client';

import { useAlertaStore } from '../stores/alertas/alertaStore';
import { calcularTiempoTranscurrido } from '@/types/alertas/Alerta';
import { Clock } from 'lucide-react';
import Link from 'next/link';
import { Button } from './ui/button';

/**
 * Componente que muestra notificaciones de alertas pendientes con la misma
 * estructura visual que el toast global (`AlertaPantalla`). Cada tarjeta
 * es un enlace a la alerta y dispone de un botón para descartarla sin
 * navegar.
 */
export function AlertaNotificaciones() {
  const { alertasPendientes, removerAlertaPendiente } = useAlertaStore();

  if (!alertasPendientes || alertasPendientes.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500">
        <p className="text-sm">No hay alertas pendientes</p>
      </div>
    );
  }

  return (
    <div>
      {alertasPendientes.map((alerta) => (
        <div key={alerta.idAlerta} className="px-4 mb-2 last:mb-0">
          <div className="flex justify-between items-center bg-red-600 text-white rounded-lg p-4 shadow-lg transition-colors dark:bg-red-600 dark:text-white min-w-[300px]">
            <div>
              <div className="font-semibold text-sm mb-1">Alerta de emergencia</div>
              <div className="text-sm">Origen: {alerta.origen}</div>
              <div className="text-xs mt-1 opacity-90 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                Hace {calcularTiempoTranscurrido(alerta.fechaHora)}
              </div>
            </div>
            <Button asChild size="sm" variant="default">
              <Link
                href={`/alertas-activas/${alerta.idAlerta}`}
                onClick={() => {
                  // Verificar si la alerta aún existe antes de removerla
                  const existeEnPendientes = alertasPendientes.some((a) => a.idAlerta === alerta.idAlerta);
                  if (existeEnPendientes) {
                    removerAlertaPendiente(alerta.idAlerta);
                  }
                }}
                className="text-xs px-2 py-1"
              >
                Detalles
              </Link>
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
