"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AlertaPantalla } from "@/components/AlertaPantalla";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Bell } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useAlertaStore } from "@/stores/alertas/alertaStore";
import { AlertaNotificaciones } from "@/components/AlertaNotificaciones";
import { Toaster } from "@/components/ui/sonner";
import { useInicializacionPrincipal } from "@/hooks/autenticacion/useInicializacionPrincipal";
import { HeaderUser } from "@/components/HeaderUser";
import { ModeToggle } from "@/components/mode-toggle";
import { EstadoConexion } from "@/components/EstadoConexion";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LayoutPrincipal({ children }: { children: React.ReactNode }) {
  const { alertasPendientes } = useAlertaStore();
  const cantidadPendientes = alertasPendientes.length;
  const router = useRouter();

  // Verificar autenticación directamente desde localStorage
  const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
  const datosUsuarioRaw = typeof window !== "undefined" ? localStorage.getItem("datosUsuario") : null;

  // Parsear datos JSON
  let datosUsuario = null;

  try {
    datosUsuario = datosUsuarioRaw ? JSON.parse(datosUsuarioRaw) : null;
  } catch (error) {
    console.warn("Error al parsear datos de localStorage:", error);
  } // Función para verificar si el token JWT está vencido
  const tokenEstaVencido = (token: string | null): boolean => {
    if (!token) return true;

    try {
      // Decodificar el payload del JWT (parte media, separada por puntos)
      const payload = token.split(".")[1];
      const decodedPayload = JSON.parse(atob(payload));

      // Verificar si tiene campo 'exp' (expiration time en segundos)
      if (!decodedPayload.exp) return false; // Si no tiene exp, asumimos válido

      // Comparar con la fecha actual (en segundos)
      const ahora = Math.floor(Date.now() / 1000);
      return decodedPayload.exp < ahora;
    } catch (error) {
      // Si hay error al decodificar, consideramos vencido
      console.warn("Error al verificar token:", error);
      return true;
    }
  };

  const tokenVencido = tokenEstaVencido(token);

  // Inicializar permisos, ubicación y WebSocket cuando esté autenticado
  useInicializacionPrincipal();

  // Si no hay token, datos de usuario, o el token está vencido, redirigir al login
  useEffect(() => {
    if (!token || !datosUsuario || tokenVencido) {
      router.push("https://kerveros-dev.policia.bo/auth/login");
    }
  }, [token, datosUsuario, tokenVencido, router]);

  // Si no está autenticado o token vencido, no renderizar
  if (!token || !datosUsuario || tokenVencido) {
    return null;
  }

  return (
    <>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <main className="flex h-screen w-full flex-col">
            <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center justify-between gap-2 bg-background border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
              <div className="flex items-center gap-2 px-4">
                <SidebarTrigger className="-ml-1" />
                <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
                <span>Sistema de Alertas Adela Zamudio</span>
              </div>

              <div className="flex items-center gap-2 px-4">
                <EstadoConexion />
                <Separator orientation="vertical" className="h-4" />

                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 p-0">
                      <Bell className="size-5" />
                      {cantidadPendientes > 0 && (
                        <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                          {cantidadPendientes > 99 ? "99+" : cantidadPendientes}
                        </Badge>
                      )}
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="w-[400px] sm:w-[540px]">
                    <SheetHeader className="mb-0">
                      <SheetTitle className="flex items-center gap-2">
                        <Bell className="w-5 h-5" />
                        Alertas Pendientes
                        {cantidadPendientes > 0 && <Badge variant="destructive">{cantidadPendientes}</Badge>}
                      </SheetTitle>
                      <SheetDescription>Alertas de emergencia que requieren atención inmediata.</SheetDescription>
                    </SheetHeader>
                    <AlertaNotificaciones />
                  </SheetContent>
                </Sheet>

                <Separator orientation="vertical" className="h-4" />
                <ModeToggle />
                <HeaderUser />
              </div>
            </header>
            <div className="flex-1 min-h-0 p-4 overflow-auto">{children}</div>
          </main>
        </SidebarInset>
      </SidebarProvider>
      <AlertaPantalla />
      <Toaster />
    </>
  );
}
