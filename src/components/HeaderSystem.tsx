'use client';

import * as React from 'react';

import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import Image from 'next/image';

export function HeaderSystem({ nombreSistema }: { nombreSistema: string }) {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton size="lg" className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
          <Image src="/logos/logo-felcv.webp" alt="Logo del sistema" width={32} height={32} className="object-contain" />

          <span className="font-semibold whitespace-normal break-words">{nombreSistema}</span>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
