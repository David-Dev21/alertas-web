'use client';

import { useAlertasSocket } from '@/hooks/alertas/useAlertasSocket';
import { toast } from 'sonner';
import { X } from 'lucide-react';
import { formatearFechaUTC } from '@/types/alertas/Alerta';
import Link from 'next/link';
import { useAlertaStore } from '../stores/alertas/alertaStore';

/**
 * Componente global para mostrar alertas en tiempo real
 * Se renderiza en el layout y escucha WebSocket
 */
export function AlertaPantalla() {
  const { agregarAlertaPendiente, removerAlertaPendiente, alertasPendientes } = useAlertaStore();

  // Suscribirse a eventos del WebSocket
  useAlertasSocket({
    onNuevaAlerta: (datos) => {
      // Solo procesar alertas PENDIENTE
      if (datos.estado === 'PENDIENTE') {
        // Agregar a pendientes
        agregarAlertaPendiente(datos);

        // Mostrar toast
        toast.custom(
          (t) => (
            <Link
              href={`/alertas-activas/${datos.idAlerta}`}
              onClick={() => {
                toast.dismiss(t);
                // Verificar si la alerta existe en pendientes antes de removerla
                const existeEnPendientes = alertasPendientes.some((a) => a.idAlerta === datos.idAlerta);
                if (existeEnPendientes) {
                  removerAlertaPendiente(datos.idAlerta);
                }
              }}
            >
              <div className="relative bg-red-600 text-white rounded-lg p-5 shadow-lg cursor-pointer hover:bg-red-700 transition-colors w-[420px]">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    toast.dismiss(t);
                  }}
                  className="absolute top-3 right-3 text-white/80 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>

                <div className="pr-8">
                  <h3 className="font-bold text-xl mb-4">ALERTA DE EMERGENCIA</h3>

                  <div className="space-y-3">
                    <div>
                      <p className="text-sm opacity-80 mb-1">Víctima</p>
                      <p className="text-lg font-semibold">{datos.victima}</p>
                    </div>

                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm opacity-80">Origen</p>
                        <p className="font-medium">{datos.origen}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs opacity-75">{formatearFechaUTC(datos.fechaHora)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ),
          {
            duration: 150000,
            position: 'top-center',
          },
        );
      }
    },
    onCancelacionSolicitud: (datos) => {
      // Mostrar toast para solicitud de cancelación
      toast.custom(
        (t) => (
          <Link
            href={`/solicitudes-cancelacion`}
            onClick={() => {
              toast.dismiss(t);
            }}
          >
            <div className="relative bg-orange-600 text-white rounded-lg p-5 shadow-lg cursor-pointer hover:bg-orange-700 transition-colors w-[420px]">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  toast.dismiss(t);
                }}
                className="absolute top-3 right-3 text-white/80 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="pr-8">
                <h3 className="font-bold text-xl mb-4">SOLICITUD DE CANCELACIÓN</h3>

                <div className="space-y-3">
                  <div>
                    <p className="text-sm opacity-80 mb-1">Víctima</p>
                    <p className="text-lg font-semibold">{datos.victima}</p>
                  </div>

                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm opacity-80">Estado</p>
                      <p className="font-medium">{datos.estado}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs opacity-75">{formatearFechaUTC(datos.fechaHora)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ),
        {
          duration: 100000,
          position: 'top-center',
        },
      );
    },
  });

  return null;
}
