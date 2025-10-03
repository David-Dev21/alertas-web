import { NextRequest, NextResponse } from "next/server";

// URL del sistema unificado de login
const LOGIN_URL = "https://kerveros-dev.policia.bo";

// Rutas que NO requieren autenticación (lista blanca)
const PUBLIC_ROUTES = ["/auth/initialize", "/login", "/unauthorized", "/"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Verificar si es una ruta pública
  const isPublicRoute = PUBLIC_ROUTES.some((route) => pathname === route || (route !== "/" && pathname.startsWith(route)));

  if (isPublicRoute) {
    return NextResponse.next();
  }

  // Verificar token de autenticación (ahora se llama access_token)
  const accessToken = request.cookies.get("access_token")?.value;

  if (!accessToken || accessToken.trim() === "") {
    // Redirigir al login externo
    return NextResponse.redirect(new URL(LOGIN_URL));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/alertas/:path*", "/funcionarios/:path*", "/eventos/:path*", "/atenciones/:path*"],
};
