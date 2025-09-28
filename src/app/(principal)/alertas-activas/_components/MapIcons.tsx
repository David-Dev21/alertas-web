'use client';
import L from 'leaflet';

// Crear iconos personalizados para los marcadores usando SVG existentes
export const createAlertIconByEstado = (estado: string) => {
  // Mapear estados a los iconos SVG disponibles
  let iconPath = '';

  switch (estado?.toLowerCase()) {
    case 'pendiente':
      iconPath = '/markers/pin-pendiente.svg';
      break;
    case 'en_atencion':
    case 'en atencion':
      iconPath = '/markers/pin-enatencion.svg';
      break;
    case 'asignada':
      iconPath = '/markers/pin-asignada.svg';
      break;
    default:
      iconPath = '/markers/pin-pendiente.svg'; // Por defecto
  }

  return L.icon({
    iconUrl: iconPath,
    iconSize: [32, 40],
    iconAnchor: [16, 40],
    popupAnchor: [0, -40],
    className: 'custom-alert-marker',
  });
};

export const createAlertIcon = () => {
  return L.divIcon({
    html: `
      <div style="
        background-color: #dc2626;
        border: 3px solid white;
        border-radius: 50%;
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
      ">
        <div style="
          background-color: white;
          border-radius: 50%;
          width: 8px;
          height: 8px;
        "></div>
      </div>
    `,
    className: 'custom-marker-alert',
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12],
  });
};

export const createOperativeIcon = () => {
  return L.divIcon({
    html: `
      <div style="
        background-color: #ea7317;
        border: 3px solid white;
        border-radius: 50%;
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
      ">
        <div style="
          background-color: white;
          border-radius: 50%;
          width: 6px;
          height: 6px;
        "></div>
      </div>
    `,
    className: 'custom-marker-operative',
    iconSize: [20, 20],
    iconAnchor: [10, 10],
    popupAnchor: [0, -10],
  });
};

export const createAssignedOperativeIcon = () => {
  return L.divIcon({
    html: `
      <div style="
        background-color: #16a34a;
        border: 3px solid white;
        border-radius: 50%;
        width: 22px;
        height: 22px;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
      ">
        <div style="
          background-color: white;
          border-radius: 50%;
          width: 8px;
          height: 8px;
        "></div>
      </div>
    `,
    className: 'custom-marker-operative-assigned',
    iconSize: [22, 22],
    iconAnchor: [11, 11],
    popupAnchor: [0, -11],
  });
};

// Icono con efecto de pulso para ubicaciones en tiempo real
export const createRealTimeLocationIcon = (tipoUsuario: 'victima' | 'operativo') => {
  const color = tipoUsuario === 'victima' ? '#dc2626' : '#3b82f6';
  const size = tipoUsuario === 'victima' ? 26 : 24;

  return L.divIcon({
    html: `
      <style>
        @keyframes pulso-ubicacion {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.2);
            opacity: 0.7;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
        .pulso-container {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .pulso-ring {
          position: absolute;
          border: 2px solid ${color};
          border-radius: 50%;
          width: ${size + 8}px;
          height: ${size + 8}px;
          animation: pulso-ubicacion 2s ease-in-out infinite;
          opacity: 0.6;
        }
      </style>
      <div class="pulso-container">
        <div class="pulso-ring"></div>
        <div style="
          background-color: ${color};
          border: 3px solid white;
          border-radius: 50%;
          width: ${size}px;
          height: ${size}px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 6px rgba(0,0,0,0.4);
          z-index: 1;
        ">
          <div style="
            background-color: white;
            border-radius: 50%;
            width: 8px;
            height: 8px;
          "></div>
        </div>
      </div>
    `,
    className: `custom-marker-realtime-${tipoUsuario}`,
    iconSize: [size + 8, size + 8],
    iconAnchor: [(size + 8) / 2, (size + 8) / 2],
    popupAnchor: [0, -(size + 8) / 2],
  });
};

// Icono para puntos de ruta - puntos simples pequeños
export const createPuntoRutaIcon = () => {
  return L.divIcon({
    html: `
      <div style="
        background-color: #6366f1;
        border: 2px solid white;
        border-radius: 50%;
        width: 12px;
        height: 12px;
        box-shadow: 0 1px 3px rgba(0,0,0,0.4);
      "></div>
    `,
    className: 'custom-marker-punto-ruta',
    iconSize: [12, 12],
    iconAnchor: [6, 6],
    popupAnchor: [0, -6],
  });
};
