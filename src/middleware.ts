import { NextRequest, NextResponse } from 'next/server';

// URL del sistema unificado de login
const LOGIN_URL = 'https://kerveros-dev.policia.bo';

// Rutas que NO requieren autenticación (lista blanca)
const PUBLIC_ROUTES = ['/auth/initialize', '/login', '/unauthorized', '/'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Verificar si es una ruta pública
  const isPublicRoute = PUBLIC_ROUTES.some((route) => pathname === route || (route !== '/' && pathname.startsWith(route)));

  if (isPublicRoute) {
    return NextResponse.next();
  }

  // COMENTADO: Verificación de token que bloquea las rutas
  const authToken = request.cookies.get('authToken')?.value;

  if (!authToken || authToken.trim() === '') {
    // Redirigir al login externo SIN returnUrl para que no regrese automáticamente
    return NextResponse.redirect(new URL(LOGIN_URL));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/alertas/:path*', '/funcionarios/:path*', '/eventos/:path*', '/atenciones/:path*'],
};
