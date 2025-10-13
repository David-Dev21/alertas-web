import { NextRequest, NextResponse } from "next/server";
import { jwtDecode } from "jwt-decode";

/**
 * Función para decodificar JWT y verificar expiración
 */
function isTokenValid(token: string): boolean {
  try {
    const decoded: any = jwtDecode(token);
    const currentTime = Math.floor(Date.now() / 1000);
    return decoded.exp > currentTime;
  } catch {
    return false;
  }
}

/**
 * Middleware de Next.js
 *
 * Verifica la autenticación mediante una cookie 'access_token'.
 * Valida que el token exista y no haya expirado (si es JWT).
 * Si no es válido, redirige al login.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Verificar token en cookies
  const token = request.cookies.get("access_token")?.value;

  if (!token || !isTokenValid(token)) {
    // Redirigir al login si no hay token válido
    const loginUrl = new URL("https://kerveros-dev.policia.bo/auth/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  // Si hay token válido, permitir acceso (la validación completa se hace en el cliente)
  return NextResponse.next();
}

export const config = {
  matcher: ["/alertas-activas/:path*", "/dashboard/:path*", "/historial-alertas/:path*", "/solicitudes-cancelacion/:path*", "/victimas/:path*"],
};
