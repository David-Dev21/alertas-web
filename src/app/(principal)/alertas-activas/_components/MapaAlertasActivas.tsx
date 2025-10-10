"use client";

import { useEffect, useRef } from "react";
import * as L from "leaflet";
import type { Map as LeafletMap } from "leaflet";
import dynamic from "next/dynamic";
import { Alerta } from "@/types/alertas/Alerta";
import { useAlertaSeleccionStore } from "@/stores/alertas/alertaSeleccionStore";
import { useAutenticacionStore } from "@/stores/autenticacion/autenticacionStore";
import { MAPA_CONFIG, obtenerCentroMapa } from "@/lib/mapaConfig";

// Importar Leaflet dinámicamente para evitar problemas de SSR
const MapContainer = dynamic(() => import("react-leaflet").then((mod) => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then((mod) => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import("react-leaflet").then((mod) => mod.Marker), { ssr: false });
const Circle = dynamic(() => import("react-leaflet").then((mod) => mod.Circle), { ssr: false });

interface MapaAlertasActivasProps {
  alertas: Alerta[];
}

export function MapaAlertasActivas({ alertas }: MapaAlertasActivasProps) {
  const mapRef = useRef<LeafletMap | null>(null);
  const { alertaDestacada } = useAlertaSeleccionStore();
  const { datosUsuario } = useAutenticacionStore();

  // Obtener centro del mapa basado en ubicación del usuario
  const centroMapa = obtenerCentroMapa(datosUsuario?.ubicacion?.latitud, datosUsuario?.ubicacion?.longitud, datosUsuario?.ubicacion?.idDepartamento);

  useEffect(() => {
    if (mapRef.current && alertas.length > 0) {
      const limites = alertas
        .filter((alerta) => alerta.ubicacion)
        .map((alerta) => [alerta.ubicacion!.geometry.coordinates[1], alerta.ubicacion!.geometry.coordinates[0]] as [number, number]);

      if (limites.length > 0) {
        mapRef.current.fitBounds(limites, { padding: [20, 20] });
      }
    }
  }, [alertas]);

  useEffect(() => {
    if (mapRef.current && alertaDestacada) {
      const alertaSeleccionada = alertas.find((alerta) => alerta.id === alertaDestacada);
      if (alertaSeleccionada?.ubicacion) {
        const lat = alertaSeleccionada.ubicacion.geometry.coordinates[1];
        const lng = alertaSeleccionada.ubicacion.geometry.coordinates[0];
        mapRef.current.setView([lat, lng], MAPA_CONFIG.zoomDestacado, { animate: true });
      }
    }
  }, [alertaDestacada, alertas]);

  const alertasConUbicacion = alertas.filter((alerta) => alerta.ubicacion);

  const iconCache: Record<string, L.Icon> = {};

  return (
    <div className="relative h-full w-full">
      <MapContainer center={centroMapa} zoom={MAPA_CONFIG.zoomDefecto} style={{ height: "100%", width: "100%" }} ref={mapRef} className="rounded-lg">
        <TileLayer attribution={MAPA_CONFIG.tileLayer.attribution} url={MAPA_CONFIG.tileLayer.url} maxZoom={MAPA_CONFIG.tileLayer.maxZoom} />

        {alertasConUbicacion.map((alerta) => {
          const esDestacada = alertaDestacada === alerta.id;
          const lat = alerta.ubicacion!.geometry.coordinates[1];
          const lng = alerta.ubicacion!.geometry.coordinates[0];

          const obtenerIcono = (estado: string) => {
            const clave = `${estado}`;
            if (iconCache[clave]) return iconCache[clave];

            let base = "/markers/pin-";
            switch (estado) {
              case "PENDIENTE":
                base += "pendiente";
                break;
              case "ASIGNADA":
                base += "asignada";
                break;
              case "EN_ATENCION":
                base += "enatencion";
                break;
              default:
                base += "pendiente";
            }

            const archivo = `${base}.svg`;
            const icono = L.icon({
              iconUrl: archivo,
              iconSize: [44, 56],
              iconAnchor: [22, 56],
              popupAnchor: [0, -36],
            });

            iconCache[clave] = icono;
            return icono;
          };

          return (
            <div key={alerta.id}>
              <Marker position={[lat, lng]} icon={obtenerIcono(alerta.estadoAlerta)} />

              {esDestacada && (
                <Circle
                  center={[lat, lng]}
                  radius={MAPA_CONFIG.circuloDestacado.radio}
                  pathOptions={{
                    color: MAPA_CONFIG.circuloDestacado.color,
                    fillColor: MAPA_CONFIG.circuloDestacado.fillColor,
                    fillOpacity: MAPA_CONFIG.circuloDestacado.fillOpacity,
                    weight: MAPA_CONFIG.circuloDestacado.weight,
                  }}
                />
              )}
            </div>
          );
        })}
      </MapContainer>

      {alertasConUbicacion.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-999">
          <div className="bg-white/80 backdrop-blur-sm p-3 rounded-lg border text-center text-sm text-gray-600">
            No hay alertas con ubicación disponible
          </div>
        </div>
      )}

      {/* Leyenda del mapa */}
      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-3 rounded-lg shadow-lg border z-[1000]">
        <div className="space-y-1 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-600 rounded-full"></div>
            <span className="text-gray-700">Alertas pendientes</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
            <span className="text-gray-700">Alertas asignadas</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-gray-700">En atención</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-primary/50 rounded-full border-2 border-primary"></div>
            <span className="text-gray-700">Alerta destacada</span>
          </div>
        </div>
      </div>
    </div>
  );
}
