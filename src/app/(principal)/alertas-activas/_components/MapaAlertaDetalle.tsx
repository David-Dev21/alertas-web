"use client";
import { useRef } from "react";
import type { Map as LeafletMap } from "leaflet";
import dynamic from "next/dynamic";
import { Alerta } from "@/services/alertas/alertasService";
import { Button } from "@/components/ui/button";
import { MapPin, Navigation, Share2 } from "lucide-react";
import { AlertaBadge } from "@/components/AlertaBadge";
import { createAlertIconByEstado, createPuntoRutaIcon } from "./MapIcons";
import { useRutaAlertaSocket } from "@/hooks/alertas/useRutaAlertaSocket";
import { MAPA_CONFIG } from "@/lib/mapaConfig";

const MapContainer = dynamic(() => import("react-leaflet").then((mod) => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then((mod) => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import("react-leaflet").then((mod) => mod.Marker), { ssr: false });
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), { ssr: false });

interface MapaAlertaDetalleProps {
  alerta: Alerta;
  mostrarFuncionarios?: boolean;
  radioFuncionariosKm?: number;
  onAsignarFuncionario?: (idFuncionario: string) => void;
}

export function MapaAlertaDetalle({ alerta }: MapaAlertaDetalleProps) {
  const mapRef = useRef<LeafletMap | null>(null);

  const { ultimoPunto, escuchandoRuta } = useRutaAlertaSocket(alerta.id);

  if (!alerta.ubicacion) {
    return (
      <div className="h-64 flex items-center justify-center bg-muted rounded-lg">
        <div className="text-center text-muted-foreground">
          <MapPin className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p className="text-lg">Sin ubicación GPS</p>
          <p className="text-sm">Esta alerta no tiene coordenadas de ubicación</p>
        </div>
      </div>
    );
  }

  const latitud = alerta.ubicacion.geometry.coordinates[1];
  const longitud = alerta.ubicacion.geometry.coordinates[0];
  const ubicacionAlerta: [number, number] = [latitud, longitud];

  const abrirEnGoogleMaps = () => {
    const url = `https://www.google.com/maps?q=${latitud},${longitud}`;
    window.open(url, "_blank");
  };

  const compartirUbicacion = async () => {
    const url = `https://www.google.com/maps?q=${latitud},${longitud}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: "Ubicación de Alerta", text: `Alerta - CUD: ${alerta.codigoCud}`, url });
      } catch {
        await navigator.clipboard.writeText(url);
        alert("Enlace copiado al portapapeles");
      }
    } else {
      await navigator.clipboard.writeText(url);
      alert("Enlace copiado al portapapeles");
    }
  };

  return (
    <>
      <div className="space-y-4">
        <div className="h-[500px] rounded-lg overflow-hidden border relative">
          <MapContainer center={ubicacionAlerta} zoom={MAPA_CONFIG.zoomDetalle} style={{ height: "100%", width: "100%" }} ref={mapRef}>
            <TileLayer attribution={MAPA_CONFIG.tileLayer.attribution} url={MAPA_CONFIG.tileLayer.url} maxZoom={MAPA_CONFIG.tileLayer.maxZoom} />

            <Marker position={ubicacionAlerta} icon={createAlertIconByEstado(alerta.estadoAlerta)}>
              <Popup>
                <div className="p-2">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-medium">Alerta de Emergencia</div>
                    <AlertaBadge estado={alerta.estadoAlerta} tamaño="sm" />
                  </div>
                  {alerta.codigoCud && <div className="text-sm text-muted-foreground mb-1">CUD: {alerta.codigoCud}</div>}
                  <div className="text-xs text-muted-foreground">{new Date(alerta.fechaHora).toLocaleString("es-BO")}</div>
                  {alerta.victima && <div className="text-sm mt-2">{alerta.victima.nombreCompleto}</div>}
                </div>
              </Popup>
            </Marker>

            {/* Renderizar último punto de ruta recibido por WebSocket */}
            {ultimoPunto && (
              <Marker
                key={`punto-ruta-${ultimoPunto.timestamp}`}
                position={[ultimoPunto.coordenadas[0], ultimoPunto.coordenadas[1]]}
                icon={createPuntoRutaIcon()}
              >
                <Popup>
                  <div className="p-2 min-w-[200px]">
                    <div className="font-semibold text-sm mb-2 text-indigo-700">Último Punto de Ruta</div>
                    <div className="space-y-2">
                      <div className="text-sm">
                        <span className="font-medium">Coordenadas:</span>
                        <div className="text-xs text-muted-foreground">
                          Lat: {ultimoPunto.coordenadas[0].toFixed(6)}, Lng: {ultimoPunto.coordenadas[1].toFixed(6)}
                        </div>
                      </div>
                      <div className="text-sm">
                        <span className="font-medium">Recibido:</span>
                        <div className="text-xs text-muted-foreground">{new Date(ultimoPunto.timestamp).toLocaleString("es-ES")}</div>
                      </div>
                    </div>
                  </div>
                </Popup>
              </Marker>
            )}
          </MapContainer>

          <div className="absolute top-2 left-2 bg-muted/80 backdrop-blur-sm p-2 rounded-lg shadow-sm text-xs z-[1000] border">
            <div className="font-medium">Coordenadas GPS</div>
            <div className="text-muted-foreground">
              {latitud.toFixed(6)}, {longitud.toFixed(6)}
            </div>
            {alerta.ubicacion.properties.accuracy && <div className="text-muted-foreground">Precisión: ±{alerta.ubicacion.properties.accuracy}m</div>}
          </div>

          {/* Indicador de estado de ruta */}
          <div className="absolute top-2 right-2 bg-muted/80 backdrop-blur-sm p-2 rounded-lg shadow-sm text-xs z-[1000] border">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${escuchandoRuta ? "bg-green-500 animate-pulse" : "bg-gray-400"}`}></div>
              <span className="font-medium">Ruta {escuchandoRuta ? "Activa" : "Inactiva"}</span>
            </div>
            {ultimoPunto && <div className="text-indigo-600 mt-1">Último punto recibido</div>}
          </div>

          <div className="absolute bottom-2 right-2 bg-muted/80 backdrop-blur-sm p-2 rounded-lg shadow-sm text-xs z-[1000] border">
            <div className="font-medium">Ubicaciones</div>
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={abrirEnGoogleMaps} className="flex-1">
            <Navigation className="w-4 h-4 mr-2" />
            Abrir en Maps
          </Button>
          <Button variant="outline" size="sm" onClick={compartirUbicacion} className="flex-1">
            <Share2 className="w-4 h-4 mr-2" />
            Compartir
          </Button>
        </div>
      </div>
    </>
  );
}
