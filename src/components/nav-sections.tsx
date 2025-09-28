'use client';

import { type LucideIcon } from 'lucide-react';
import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from '@/components/ui/sidebar';
import Link from 'next/link';

export function NavSections({
  secciones,
  titulo = 'Sección',
}: {
  secciones: {
    nombre: string;
    url: string;
    icono: LucideIcon;
  }[];
  titulo?: string;
}) {
  const { state } = useSidebar();
  const isCollapsed = state === 'collapsed';

  return (
    <SidebarGroup className={isCollapsed ? '' : 'group-data-[collapsible=icon]:hidden'}>
      {!isCollapsed && <SidebarGroupLabel>{titulo}</SidebarGroupLabel>}
      <SidebarMenu>
        {secciones.map((elemento) => (
          <SidebarMenuItem key={elemento.nombre}>
            <SidebarMenuButton asChild tooltip={isCollapsed ? elemento.nombre : undefined}>
              <Link href={elemento.url}>
                <elemento.icono />
                {!isCollapsed && <span>{elemento.nombre}</span>}
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
