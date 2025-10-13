"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal, CheckCircle, XCircle, Eye, Trash2, Clock } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Victima } from "@/types/response/victimas";
import { formatearFechaUTC } from "@/lib/utils";
import Link from "next/link";

function AccionesVictima({ victima }: { victima: Victima }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Abrir menú</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Acciones</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href={`/victimas/${victima.id}`}>
            <Eye className="mr-2 h-4 w-4" />
            Ver Historial de Alertas
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export const columnasVictimas: ColumnDef<Victima>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => <Checkbox checked={row.getIsSelected()} onCheckedChange={(value) => row.toggleSelected(!!value)} aria-label="Select row" />,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "cedulaIdentidad",
    header: "Cédula de Identidad",
    cell: ({ row }) => <div className="font-medium">{row.getValue("cedulaIdentidad")}</div>,
  },
  {
    accessorKey: "nombres",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Nombres
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => <div className="font-medium">{row.getValue("nombres")}</div>,
  },
  {
    accessorKey: "apellidos",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Apellidos
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => <div className="font-medium">{row.getValue("apellidos")}</div>,
  },
  {
    accessorKey: "celular",
    header: "Celular",
    cell: ({ row }) => <div className="font-mono">{row.getValue("celular")}</div>,
  },
  {
    accessorKey: "correo",
    header: "Correo",
    cell: ({ row }) => <div className="lowercase">{row.getValue("correo")}</div>,
  },
  {
    accessorKey: "estadoCuenta",
    header: "Estado",
    cell: ({ row }) => {
      const estado = row.getValue("estadoCuenta") as string;
      const obtenerTextoEstado = (estado: string) => {
        switch (estado) {
          case "ACTIVA":
            return "Activa";
          case "INACTIVA":
            return "Inactiva";
          case "SUSPENDIDA":
            return "Suspendida";
          case "PENDIENTE_VERIFICACION":
            return "Pendiente Verificación";
          default:
            return estado;
        }
      };

      const obtenerVariantEstado = (estado: string) => {
        switch (estado) {
          case "ACTIVA":
            return "default";
          case "INACTIVA":
            return "secondary";
          case "SUSPENDIDA":
            return "destructive";
          case "PENDIENTE_VERIFICACION":
            return "outline";
          default:
            return "outline";
        }
      };

      return <Badge variant={obtenerVariantEstado(estado)}>{obtenerTextoEstado(estado)}</Badge>;
    },
  },
  {
    accessorKey: "creadoEn",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Fecha de Registro
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const fecha = row.getValue("creadoEn") as string;
      return (
        <div className="text-sm">
          <div className="flex items-center gap-1">
            <Clock className="size-3" />
            <div className="font-medium">{formatearFechaUTC(fecha)}</div>
          </div>
        </div>
      );
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const victima = row.original;

      return <AccionesVictima victima={victima} />;
    },
  },
];
