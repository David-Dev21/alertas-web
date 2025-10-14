"use client";
import { useState, useCallback, useEffect } from "react";
import type { LeafletMouseEvent } from "leaflet";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { MapPin, Loader2 } from "lucide-react";
import { MAPA_CONFIG } from "@/lib/mapaConfig";
import { createAssignedOperativeIcon } from "./MapIcons";

const MapContainer = dynamic(() => import("react-leaflet").then((mod) => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then((mod) => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import("react-leaflet").then((mod) => mod.Marker), { ssr: false });

// Componente para manejar eventos del mapa - importado dinámicamente
const MapEventHandler = dynamic(
  () =>
    import("react-leaflet").then((mod) => {
      const { useMap } = mod;

      function MapEventHandlerComponent({ onMapClick }: { onMapClick: (latlng: [number, number]) => void }) {
        const map = useMap();

        useEffect(() => {
          if (!map) return;

          const handleClick = (event: LeafletMouseEvent) => {
            const { lat, lng } = event.latlng;
            onMapClick([lat, lng]);
          };

          map.on("click", handleClick);

          return () => {
            map.off("click", handleClick);
          };
        }, [map, onMapClick]);

        return null;
      }

      return { default: MapEventHandlerComponent };
    }),
  { ssr: false }
);

// Componente para centrar el mapa
const MapCenterHandler = dynamic(
  () =>
    import("react-leaflet").then((mod) => {
      const { useMap } = mod;

      function MapCenterHandlerComponent({ center }: { center: [number, number] | null }) {
        const map = useMap();

        useEffect(() => {
          if (center && map) {
            map.setView(center, MAPA_CONFIG.zoomDestacado);
          }
        }, [center, map]);

        return null;
      }

      return { default: MapCenterHandlerComponent };
    }),
  { ssr: false }
);

interface MapaSeleccionUbicacionProps {
  ubicacionInicial?: [number, number];
  onUbicacionSeleccionada: (ubicacion: [number, number]) => void;
  onAceptar?: () => void;
  onCancelar?: () => void;
}

export function MapaSeleccionUbicacion({ ubicacionInicial, onUbicacionSeleccionada, onAceptar, onCancelar }: MapaSeleccionUbicacionProps) {
  const [cargando, setCargando] = useState(true);
  const [ubicacionTemporal, setUbicacionTemporal] = useState<[number, number] | null>(null);
  const [centrarEn, setCentrarEn] = useState<[number, number] | null>(null);

  const manejarCargaMapa = useCallback(() => {
    setCargando(false);
  }, []);

  const manejarMapClick = useCallback((latlng: [number, number]) => {
    setUbicacionTemporal(latlng);
  }, []);

  const manejarAceptar = useCallback(() => {
    if (ubicacionTemporal) {
      onUbicacionSeleccionada(ubicacionTemporal);
      onAceptar?.();
    }
  }, [ubicacionTemporal, onUbicacionSeleccionada, onAceptar]);

  const centrarEnUbicacionActual = useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCentrarEn([latitude, longitude]);
        },
        (error) => {
          console.error("Error obteniendo ubicación:", error);
        }
      );
    }
  }, []);

  return (
    <div className="relative">
      {cargando && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted/50 z-10 rounded-lg">
          <div className="flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Cargando mapa...</span>
          </div>
        </div>
      )}

      <div className="h-96 rounded-lg overflow-hidden border relative">
        <MapContainer
          center={ubicacionInicial || MAPA_CONFIG.centroDefecto}
          zoom={ubicacionInicial ? MAPA_CONFIG.zoomDestacado : MAPA_CONFIG.zoomDefecto}
          style={{ height: "100%", width: "100%" }}
          whenReady={manejarCargaMapa}
        >
          <TileLayer attribution={MAPA_CONFIG.tileLayer.attribution} url={MAPA_CONFIG.tileLayer.url} maxZoom={MAPA_CONFIG.tileLayer.maxZoom} />

          {ubicacionInicial && <Marker position={ubicacionInicial} icon={createAssignedOperativeIcon()} />}

          {ubicacionTemporal && !ubicacionInicial && <Marker position={ubicacionTemporal} icon={createAssignedOperativeIcon()} />}

          <MapEventHandler onMapClick={manejarMapClick} />
          <MapCenterHandler center={centrarEn} />
        </MapContainer>

        {/* Instrucciones */}
        <div className="absolute top-2 left-2 bg-background/90 backdrop-blur-sm p-3 rounded-lg shadow-sm text-sm z-[1000] border max-w-xs">
          <div className="font-medium mb-1">Seleccionar ubicación</div>
          <div className="text-muted-foreground text-xs">Haga clic en el mapa para seleccionar la ubicación de trabajo del funcionario</div>
        </div>

        {/* Botón para centrar en ubicación actual */}
        <div className="absolute top-2 right-2 z-[1000]">
          <Button variant="outline" size="sm" onClick={centrarEnUbicacionActual} className="bg-background/90 backdrop-blur-sm">
            <MapPin className="w-4 h-4 mr-2" />
            Mi ubicación
          </Button>
        </div>

        {/* Indicador de coordenadas */}
        {ubicacionTemporal && (
          <div className="absolute bottom-2 left-2 bg-background/90 backdrop-blur-sm p-2 rounded-lg shadow-sm text-xs z-[1000] border">
            <div className="font-medium">Ubicación seleccionada</div>
            <div className="text-muted-foreground">
              {ubicacionTemporal[0].toFixed(6)}, {ubicacionTemporal[1].toFixed(6)}
            </div>
          </div>
        )}
      </div>

      {/* Botones de acción */}
      <div className="flex gap-2 mt-4">
        <Button variant="outline" onClick={onCancelar} className="flex-1">
          Cancelar
        </Button>
        <Button onClick={manejarAceptar} disabled={!ubicacionTemporal} className="flex-1">
          Aceptar
        </Button>
      </div>
    </div>
  );
}
