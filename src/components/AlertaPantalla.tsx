"use client";

import { useAlertasSocket } from "@/hooks/alertas/useAlertasSocket";
import { toast } from "sonner";
import { X } from "lucide-react";
import { formatearFechaUTC } from "@/lib/utils";
import Link from "next/link";
import { useAlertaStore } from "../stores/alertas/alertaStore";
import { useEffect, useRef } from "react";

/**
 * Componente global para mostrar alertas en tiempo real
 * Se renderiza en el layout y escucha WebSocket
 */
export function AlertaPantalla() {
  const { agregarAlertaPendiente, alertasPendientes } = useAlertaStore();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Efecto para unlock audio al montar
  useEffect(() => {
    const initAudio = async () => {
      audioContextRef.current = new AudioContext();
      if (audioContextRef.current.state === "suspended") {
        await audioContextRef.current.resume();
      }
      // Reproducir buffer silencioso para unlock completo
      const buffer = audioContextRef.current.createBuffer(1, 1, 22050);
      const source = audioContextRef.current.createBufferSource();
      source.buffer = buffer;
      source.connect(audioContextRef.current.destination);
      source.start(0);
    };
    initAudio();

    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  // Efecto para reproducir sonido continuo mientras haya alertas pendientes
  useEffect(() => {
    if (alertasPendientes.length > 0) {
      // Iniciar reproducción continua con loop
      if (!audioRef.current) {
        try {
          const audio = new Audio("/sonido/sonido-2.mp3");
          audio.loop = true;
          audioRef.current = audio;
          audio.play().catch((error) => {
            console.warn("No se pudo reproducir el sonido de alerta continuo:", error);
          });
        } catch (error) {
          console.warn("Error al cargar el sonido de alerta continuo:", error);
        }
      }
    } else {
      // Detener si no hay alertas
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        audioRef.current = null;
      }
    }

    // Limpiar al desmontar
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };
  }, [alertasPendientes.length]);

  // Suscribirse a eventos del WebSocket
  useAlertasSocket({
    onNuevaAlerta: (datos) => {
      console.log("🔔 Evento nuevaAlerta recibido en frontend:", datos); // Log temporal
      // Solo procesar alertas PENDIENTE
      if (datos.estado === "PENDIENTE") {
        // Agregar a pendientes
        agregarAlertaPendiente(datos);

        // Mostrar toast
        toast.custom(
          (t) => (
            <Link
              href={`/alertas-activas/${datos.idAlerta}`}
              onClick={() => {
                toast.dismiss(t);
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
                        <p>{formatearFechaUTC(datos.fechaHora)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ),
          {
            duration: 150000,
            position: "top-center",
          }
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
                      <p>{formatearFechaUTC(datos.fechaHora)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ),
        {
          duration: 100000,
          position: "top-center",
        }
      );
    },
  });

  return null;
}
