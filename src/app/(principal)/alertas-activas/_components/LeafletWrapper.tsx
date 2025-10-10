'use client';

import { useEffect, useState } from 'react';

interface LeafletWrapperProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function LeafletWrapper({ children, fallback }: LeafletWrapperProps) {
  const [isLeafletReady, setIsLeafletReady] = useState(false);

  useEffect(() => {
    // Cargar Leaflet dinámicamente en el cliente y configurar iconos por defecto
    const initLeaflet = async () => {
      if (typeof window === 'undefined') return;
      try {
        const L = await import('leaflet');

        // Intentar importar las imágenes de los iconos para que Next resuelva sus URLs
        let iconUrl: string | undefined;
        let iconRetinaUrl: string | undefined;
        let shadowUrl: string | undefined;

        try {
          // Estas importaciones deberían devolver la URL del asset
          // Vienen de node_modules/leaflet/dist/images
          // Si el bundler no soporta este patrón, el bloque fallará y seguimos sin reemplazar iconos.
          // @ts-ignore
          iconRetinaUrl = (await import('leaflet/dist/images/marker-icon-2x.png')).default;
          // @ts-ignore
          iconUrl = (await import('leaflet/dist/images/marker-icon.png')).default;
          // @ts-ignore
          shadowUrl = (await import('leaflet/dist/images/marker-shadow.png')).default;
        } catch (err) {
          // No crítico: si no se pueden importar las imágenes, Leaflet intentará usar rutas relativas.
          console.warn('No se pudieron importar iconos de leaflet:', err);
        }

        try {
          // Merge options sólo si está disponible
          if (L && L.Icon && L.Icon.Default) {
            const defaults: any = {};
            if (iconUrl) defaults.iconUrl = iconUrl;
            if (iconRetinaUrl) defaults.iconRetinaUrl = iconRetinaUrl;
            if (shadowUrl) defaults.shadowUrl = shadowUrl;
            if (Object.keys(defaults).length > 0) {
              L.Icon.Default.mergeOptions(defaults);
            }
          }
        } catch (err) {
          console.warn('Error configurando iconos de Leaflet:', err);
        }

        // Exponer L en window por compatibilidad con código existente
        (window as any).L = L;
        setIsLeafletReady(true);
      } catch (error) {
        console.error('Error cargando Leaflet dinámicamente:', error);
        setIsLeafletReady(false);
      }
    };

    initLeaflet();
  }, []);

  // Extensión de window para TypeScript
  if (typeof window !== 'undefined') {
    (window as any).L = (window as any).L || {};
  }

  if (typeof window === 'undefined' || !isLeafletReady) {
    return (
      <>
        {fallback || (
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg animate-pulse">
            <div className="text-center text-gray-500">
              <div className="w-12 h-12 mx-auto mb-2 bg-gray-300 rounded animate-pulse"></div>
              <p className="text-lg">Cargando mapa...</p>
            </div>
          </div>
        )}
      </>
    );
  }

  return <>{children}</>;
}

// Declaración de tipos para TypeScript
declare global {
  interface Window {
    L: any;
  }
}
