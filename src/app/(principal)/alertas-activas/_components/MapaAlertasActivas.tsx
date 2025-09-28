'use client';

import { useEffect, useRef, useState } from 'react';
import * as L from 'leaflet';
import dynamic from 'next/dynamic';
import './mapa-alertas.css';
import { Alerta } from '@/types/alertas/Alerta';
import { useAlertaSeleccionStore } from '@/stores/alertas/alertaSeleccionStore';

// Importar Leaflet dinámicamente para evitar problemas de SSR
const MapContainer = dynamic(() => import('react-leaflet').then((mod) => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then((mod) => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then((mod) => mod.Marker), { ssr: false });
const Circle = dynamic(() => import('react-leaflet').then((mod) => mod.Circle), { ssr: false });

interface MapaAlertasActivasProps {
  alertas: Alerta[];
}

export function MapaAlertasActivas({ alertas }: MapaAlertasActivasProps) {
  const mapRef = useRef<any>(null);
  const { alertaDestacada } = useAlertaSeleccionStore();
  const [isClient, setIsClient] = useState(false);
  const [mapKey, setMapKey] = useState(0);

  // Configuración por defecto del mapa (La Paz, Bolivia)
  const defaultCenter: [number, number] = [-16.5, -68.15];
  const defaultZoom = 12;

  // Asegurar que estamos en el cliente
  useEffect(() => {
    setIsClient(true);
    setMapKey(Date.now()); // Usar timestamp para clave única
  }, []);

  // Limpiar el mapa cuando el componente se desmonte
  useEffect(() => {
    return () => {
      if (mapRef.current) {
        try {
          mapRef.current.remove();
          mapRef.current = null;
        } catch (error) {
          console.log('Error cleaning up map:', error);
        }
      }
    };
  }, []);

  useEffect(() => {
    // Ajustar vista del mapa cuando cambien las alertas
    if (mapRef.current && alertas.length > 0) {
      const bounds = alertas
        .filter((alerta) => alerta.ubicacion)
        .map(
          (alerta) =>
            [
              alerta.ubicacion!.geometry.coordinates[1], // latitud
              alerta.ubicacion!.geometry.coordinates[0], // longitud
            ] as [number, number],
        );

      if (bounds.length > 0) {
        mapRef.current.fitBounds(bounds, { padding: [20, 20] });
      }
    }
  }, [alertas]);

  // Centrar el mapa en la alerta destacada
  useEffect(() => {
    if (mapRef.current && alertaDestacada) {
      const alertaSeleccionada = alertas.find((alerta) => alerta.id === alertaDestacada);
      if (alertaSeleccionada && alertaSeleccionada.ubicacion) {
        const lat = alertaSeleccionada.ubicacion.geometry.coordinates[1];
        const lng = alertaSeleccionada.ubicacion.geometry.coordinates[0];

        // Centrar y hacer zoom en la alerta destacada
        mapRef.current.setView([lat, lng], 16, { animate: true });
      }
    }
  }, [alertaDestacada, alertas]);

  const alertasConUbicacion = alertas.filter((alerta) => alerta.ubicacion);

  // Cache simple para iconos por color (evita recrearlos cada render)
  const iconCache: Record<string, L.Icon | L.DivIcon> = {};

  // Debug: imprimir alertas con ubicación y el icono estático seleccionado
  useEffect(() => {
    if (!alertasConUbicacion) return;
    if (alertasConUbicacion.length === 0) {
      console.log('[MapaAlertasActivas] no hay alertas con ubicación');
      return;
    }

    console.log('[MapaAlertasActivas] alertasConUbicacion:', alertasConUbicacion.length);
    alertasConUbicacion.forEach((a) => {
      const estado = a.estadoAlerta;
      const destacado = alertaDestacada === a.id;
      let base = '/markers/pin-';
      switch (estado) {
        case 'PENDIENTE':
          base += 'pendiente';
          break;
        case 'ASIGNADA':
          base += 'asignada';
          break;
        case 'EN_ATENCION':
          base += 'enatencion';
          break;
        default:
          base += 'pendiente';
      }
      const file = destacado ? `${base}-destacado.svg` : `${base}.svg`;
    });
  }, [alertasConUbicacion, alertaDestacada]);

  // No renderizar hasta que estemos en el cliente
  if (!isClient) {
    return (
      <div className="relative h-full w-full">
        <div className="h-full flex items-center justify-center bg-gray-50 rounded-lg animate-pulse">
          <div className="text-center text-gray-500">
            <p className="text-lg">Cargando mapa...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-full w-full">
      <MapContainer
        key={`main-map-${mapKey}`} // Clave única para evitar reutilización
        center={defaultCenter}
        zoom={defaultZoom}
        style={{ height: '100%', width: '100%' }}
        ref={mapRef}
        className="rounded-lg"
        whenReady={() => {
          console.log('Mapa principal listo');
        }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Marcadores de alertas (solo si hay ubicaciones) */}
        {alertasConUbicacion.length > 0 &&
          alertasConUbicacion.map((alerta) => {
            const esAlertaDestacada = alertaDestacada === alerta.id;
            const lat = alerta.ubicacion!.geometry.coordinates[1];
            const lng = alerta.ubicacion!.geometry.coordinates[0];

            // Seleccionar iconos estáticos en /public/markers según estado y destacado
            const seleccionarIconoEstatico = (estado: string, destacado = false) => {
              const key = `${estado}-${destacado ? '1' : '0'}`;
              if (iconCache[key]) return iconCache[key];

              let base = '/markers/pin-';
              switch (estado) {
                case 'PENDIENTE':
                  base += 'pendiente';
                  break;
                case 'ASIGNADA':
                  base += 'asignada';
                  break;
                case 'EN_ATENCION':
                  base += 'enatencion';
                  break;
                default:
                  base += 'pendiente';
              }

              const file = destacado ? `${base}-destacado.svg` : `${base}.svg`;

              const icon = L.icon({
                iconUrl: file,
                iconSize: destacado ? [56, 72] : [44, 56],
                iconAnchor: destacado ? [28, 72] : [22, 56],
                popupAnchor: [0, destacado ? -50 : -36],
              });

              iconCache[key] = icon;
              return icon;
            };

            return (
              <div key={alerta.id}>
                <Marker position={[lat, lng]} icon={seleccionarIconoEstatico(alerta.estadoAlerta, esAlertaDestacada)} />

                {esAlertaDestacada && (
                  <Circle
                    center={[lat, lng]}
                    radius={200}
                    pathOptions={{
                      color: '#55632E',
                      fillColor: '#55632E',
                      fillOpacity: 0.5,
                      weight: 4,
                    }}
                  />
                )}
              </div>
            );
          })}
      </MapContainer>

      {/* Overlay informativo si no hay marcadores */}
      {alertasConUbicacion.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="bg-white/80 backdrop-blur-sm p-3 rounded-lg border text-center text-sm text-gray-600">
            No hay alertas con ubicación disponible
            <div className="text-xs text-gray-500">Las alertas aparecerán aquí cuando tengan coordenadas GPS</div>
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
