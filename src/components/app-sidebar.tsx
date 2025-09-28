'use client';

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
} from 'lucide-react';
import { NavSections } from '@/components/nav-sections';
import { HeaderSystem } from '@/components/HeaderSystem';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail } from '@/components/ui/sidebar';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/hooks/autenticacion/useAutenticacion';

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { system, isHydrated } = useAuth();

  // Mostrar loading mientras se hidrata
  if (!isHydrated) {
    return (
      <Sidebar collapsible="icon" {...props}>
        <SidebarHeader>
          <div className="p-4">
            <Skeleton className="h-8 w-full" />
          </div>
        </SidebarHeader>
        <SidebarContent>
          <div className="p-4 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-4 w-1/3" />
          </div>
        </SidebarContent>
        <SidebarFooter>
          <div className="p-4">
            <Skeleton className="h-10 w-full" />
          </div>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
    );
  }

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
    const normalizedIconName = iconName?.replace(/\s+/g, '').replace(/^\w/, (c) => c.toUpperCase()) || '';
    return iconMap[normalizedIconName] || Home;
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <HeaderSystem nombreSistema="SISTEMA DE ALERTAS" />
      </SidebarHeader>
      <SidebarContent>
        {/* Módulos del sistema */}
        {system.modules.map((module) => (
          <NavSections
            key={module.name}
            secciones={module.children.map((child) => ({
              nombre: child.name,
              url: child.path,
              icono: getIcon(child.icon),
            }))}
            titulo={module.name}
          />
        ))}
      </SidebarContent>
      <SidebarFooter>{/* Footer vacío - usuario movido al header */}</SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
