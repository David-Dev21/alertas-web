"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal, Eye, Clock } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Alerta } from "@/types/alertas/Alerta";
import { formatearFechaUTC } from "@/lib/utils";
import { obtenerTextoEstado } from "@/types/alertas/Alerta";

function AccionesAlerta({ alerta }: { alerta: Alerta }) {
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
        <DropdownMenuItem onClick={() => (window.location.href = `/historial-alertas/${alerta.id}`)}>
          <Eye className="mr-2 h-4 w-4" />
          Ver detalles
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export const columnasHistorial: ColumnDef<Alerta>[] = [
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
    accessorFn: (row) => row.victima?.cedulaIdentidad || "",
    id: "cedula",
    header: "Cédula",
    cell: ({ row }) => <div className="font-medium">{row.getValue("cedula")}</div>,
    enableSorting: false,
  },
  {
    accessorFn: (row) => `${row.victima?.nombres || ""} ${row.victima?.apellidos || ""}`,
    id: "victima",
    header: "Víctima",
    cell: ({ row }) => (
      <div>
        <div className="font-medium">{row.getValue("victima")}</div>
        <div className="text-sm text-muted-foreground font-mono">{(row.original as any).victima?.celular || "Sin celular"}</div>
      </div>
    ),
    enableSorting: false,
  },
  {
    accessorKey: "municipio",
    header: "Municipio",
    cell: ({ row }) => <div className="capitalize">{row.getValue("municipio")}</div>,
    enableSorting: false,
  },
  {
    accessorKey: "provincia",
    header: "Provincia",
    cell: ({ row }) => <div className="capitalize">{row.getValue("provincia")}</div>,
    enableSorting: false,
  },
  {
    accessorKey: "departamento",
    header: "Departamento",
    cell: ({ row }) => <div className="capitalize">{row.getValue("departamento")}</div>,
    enableSorting: false,
  },
  {
    accessorKey: "origen",
    header: "Origen",
    enableSorting: false,
  },
  {
    accessorKey: "estadoAlerta",
    header: "Estado",
    cell: ({ row }) => {
      const estado = row.getValue("estadoAlerta") as any;
      return <div>{obtenerTextoEstado(estado)}</div>;
    },
  },
  {
    accessorKey: "fechaHora",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Fecha
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const fecha = row.getValue("fechaHora") as string;
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
      const alerta = row.original as Alerta;
      return <AccionesAlerta alerta={alerta} />;
    },
  },
];

export default columnasHistorial;
