"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { UsuarioWeb } from "@/services/usuariosWebService";
import { formatearFechaUTC } from "@/lib/utils";

export const crearColumnasUsuariosWeb = () => {
  const columnas: ColumnDef<UsuarioWeb>[] = [
    {
      accessorKey: "grado",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Grado
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => <div className="font-medium">{row.getValue("grado")}</div>,
    },
    {
      accessorKey: "nombreCompleto",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Nombre Completo
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => <div className="font-medium">{row.getValue("nombreCompleto")}</div>,
    },
    {
      accessorKey: "unidad",
      header: "Unidad",
      cell: ({ row }) => <div>{row.getValue("unidad")}</div>,
    },
    {
      accessorKey: "estadoSession",
      header: "Estado de Sesión",
      cell: ({ row }) => {
        const estado = row.getValue("estadoSession") as boolean;
        return <Badge variant={estado ? "default" : "destructive"}>{estado ? "Conectado" : "Desconectado"}</Badge>;
      },
    },
    {
      accessorKey: "actualizadoEn",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Última Actualización
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const fecha = row.getValue("actualizadoEn") as string;
        return (
          <div className="text-sm">
            <div className="font-medium">{formatearFechaUTC(fecha)}</div>
          </div>
        );
      },
    },
  ];

  return columnas;
};

export const columnasUsuariosWeb = crearColumnasUsuariosWeb();
