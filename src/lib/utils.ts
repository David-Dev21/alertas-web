import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
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

/**
 * Función para limpiar y formatear el nombre completo
 * @param nombreCrudo - El nombre crudo a formatear
 * @returns Nombre formateado
 */
export function formatearNombreCompleto(nombreCrudo: string): string {
  return nombreCrudo
    .trim()
    .split(/\s+/) // Dividir por uno o más espacios
    .filter((parte) => parte.length > 0) // Eliminar partes vacías
    .map((parte) => parte.charAt(0).toUpperCase() + parte.slice(1).toLowerCase()) // Capitalizar cada parte
    .join(" "); // Unir con espacio simple
}

/**
 * Formatea una fecha UTC a un formato legible en Bolivia
 * @param fechaUTC - La fecha en formato string UTC
 * @returns Fecha formateada como "12 de octubre 14:30"
 */
export function formatearFechaUTC(fechaUTC: string): string {
  try {
    // Normalizar string UTC si es necesario
    let fechaNormalizada = fechaUTC;

    // Si no tiene timezone, añadir Z
    if (!fechaUTC.includes("Z") && !fechaUTC.includes("+") && !fechaUTC.includes("-")) {
      fechaNormalizada = fechaUTC + "Z";
    }

    // Crear fecha desde string UTC normalizado
    const fecha = new Date(fechaNormalizada);

    // Verificar si la fecha es válida
    if (isNaN(fecha.getTime())) {
      throw new Error("Fecha inválida");
    }

    return fecha.toLocaleString("es-BO", {
      timeZone: "America/La_Paz",
      day: "numeric",
      month: "long",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch (error) {
    console.error("Error al formatear fecha UTC:", error, "Input:", fechaUTC);
    return "Fecha no disponible";
  }
}
