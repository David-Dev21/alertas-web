"use client";

import { LogOut, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/autenticacion/useAutenticacion";

export function HeaderUser() {
  const { usuario, cerrarSesion } = useAuth();

  const datosUsuario = {
    nombre: usuario.nombreCompleto || usuario.nombre,
    correo: usuario.correo,
    avatar: usuario.imagenUsuario,
  };

  const manejarCerrarSesion = () => {
    cerrarSesion();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="relative p-1 rounded-full hover:bg-muted transition-colors" aria-label="Menú de usuario">
          <Avatar className="h-8 w-8 rounded-full">
            <AvatarImage src={datosUsuario.avatar} alt={datosUsuario.nombre} />
            <AvatarFallback className="rounded-full">
              {datosUsuario.nombre
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 rounded-lg" side="bottom" align="end" sideOffset={8}>
        <DropdownMenuLabel className="p-0 font-normal">
          <div className="flex items-center gap-3 px-3 py-2 text-left text-sm">
            <Avatar className="h-10 w-10 rounded-full">
              <AvatarImage src={datosUsuario.avatar} alt={datosUsuario.nombre} />
              <AvatarFallback className="rounded-full">
                {datosUsuario.nombre
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold">{datosUsuario.nombre}</span>
              <span className="truncate text-xs text-muted-foreground">{datosUsuario.correo}</span>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <User className="w-4 h-4" />
            Mi Perfil
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={manejarCerrarSesion} className="text-destructive focus:text-destructive">
          <LogOut className="w-4 h-4" />
          Cerrar Sesión
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
