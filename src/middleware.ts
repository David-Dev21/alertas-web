import { NextRequest, NextResponse } from "next/server";

// Rutas que NO requieren autenticación (lista blanca)
const PUBLIC_ROUTES = ["/auth/initialize", "/login", "/unauthorized", "/"];

/**
 * Middleware de Next.js
 *
 * Nota: El middleware corre en el servidor y no tiene acceso a localStorage.
 * La validación real de autenticación se hace en el cliente mediante el
 * componente InicializadorAutenticacion que verifica el token en localStorage
 * y redirige al login si no está autenticado.
 *
 * Este middleware solo se encarga de:
 * - Permitir el acceso a rutas públicas sin validación
 * - Dejar pasar las rutas protegidas (la validación del cliente las manejará)
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Verificar si es una ruta pública
  const isPublicRoute = PUBLIC_ROUTES.some((route) => pathname === route || (route !== "/" && pathname.startsWith(route)));

  if (isPublicRoute) {
    return NextResponse.next();
  }

  // Las rutas protegidas pasan, la validación la hace el cliente
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/alertas/:path*", "/funcionarios/:path*", "/eventos/:path*", "/atenciones/:path*"],
};
