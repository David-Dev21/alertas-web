import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formatea una fecha y hora de manera legible
 * @param fecha - La fecha a formatear
 * @returns Objeto con hora y fecha formateadas
 */
export function formatearFechaHora(fecha: string | Date) {
  const fechaObj = new Date(fecha);

  // Formatear hora con minutos
  const hora = fechaObj.toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

  // Formatear fecha completa
  const opcionesFecha: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  };

  const fechaFormateada = fechaObj.toLocaleDateString('es-ES', opcionesFecha);

  return {
    hora,
    fecha: fechaFormateada,
    completo: `${hora}\n${fechaFormateada}`,
  };
}
