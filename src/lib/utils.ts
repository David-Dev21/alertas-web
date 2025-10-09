import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

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
  const hora = fechaObj.toLocaleTimeString("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  // Formatear fecha completa
  const opcionesFecha: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "long",
    year: "numeric",
  };

  const fechaFormateada = fechaObj.toLocaleDateString("es-ES", opcionesFecha);

  return {
    hora,
    fecha: fechaFormateada,
    completo: `${hora}\n${fechaFormateada}`,
  };
}

/**
 * Calcula la edad a partir de la fecha de nacimiento
 * @param fechaNacimiento - Fecha de nacimiento en formato string
 * @returns Edad en años o null si no se puede calcular
 */
export function calcularEdad(fechaNacimiento?: string): number | null {
  if (!fechaNacimiento) return null;
  const hoy = new Date();
  const nacimiento = new Date(fechaNacimiento);
  let edad = hoy.getFullYear() - nacimiento.getFullYear();
  const mes = hoy.getMonth() - nacimiento.getMonth();
  if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
    edad--;
  }
  return edad;
}
