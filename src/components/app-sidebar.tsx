"use client";

import {
  Home,
  UsersRound,
  BarChart3,
  Shield,
  User,
  CheckCircle,
  Calendar,
  MapPin,
  Monitor,
  UserRound,
  MessageSquareWarning,
  ClockAlert,
  ShieldAlert,
  type LucideIcon,
} from "lucide-react";
import { NavSections } from "@/components/nav-sections";
import { HeaderSystem } from "@/components/HeaderSystem";
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail } from "@/components/ui/sidebar";
import { useAuth } from "@/hooks/autenticacion/useAutenticacion";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { sistema } = useAuth();

  // Función para obtener el icono por nombre
  const getIcon = (iconName?: string): LucideIcon => {
    const iconMap: Record<string, LucideIcon> = {
      Home: Home,
      UsersRound: UsersRound,
      BarChart3: BarChart3,
      Shield: Shield,
      User: User,
      ShieldAlert: ShieldAlert,
      CheckCircle: CheckCircle,
      Calendar: Calendar,
      MapPin: MapPin,
      Monitor: Monitor,
      UserRound: UserRound,
      MessageSquareWarning: MessageSquareWarning,
      ClockAlert: ClockAlert,
      Settings: Shield,
      FileText: BarChart3,
    };
    const normalizedIconName = iconName?.replace(/\s+/g, "").replace(/^\w/, (c) => c.toUpperCase()) || "";
    return iconMap[normalizedIconName] || Home;
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <HeaderSystem nombreSistema="SISTEMA DE ALERTAS" />
      </SidebarHeader>
      <SidebarContent>
        {/* Módulos del sistema */}
        {sistema.modulos.map((modulo) => (
          <NavSections
            key={modulo.nombre}
            secciones={modulo.hijos.map((hijo) => ({
              nombre: hijo.nombre,
              url: hijo.ruta,
              icono: getIcon(hijo.icono),
            }))}
            titulo={modulo.nombre}
          />
        ))}
      </SidebarContent>
      <SidebarFooter>{/* Footer vacío - usuario movido al header */}</SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
