"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal, Eye, Clock } from "lucide-react";

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
import { Personal } from "@/services/personalService";
import { formatearFechaUTC } from "@/lib/utils";

function AccionesPersonal({ personal }: { personal: Personal }) {
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
        <DropdownMenuItem onClick={() => navigator.clipboard.writeText(personal.id)}>
          <Eye className="mr-2 h-4 w-4" />
          Copiar ID
        </DropdownMenuItem>
        <DropdownMenuSeparator />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export const columnasPersonal: ColumnDef<Personal>[] = [
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
    accessorKey: "escalafon",
    header: "Escalafón",
    cell: ({ row }) => <div>{row.getValue("escalafon")}</div>,
  },
  {
    accessorKey: "departamento",
    header: "Departamento",
    cell: ({ row }) => <div>{row.getValue("departamento")}</div>,
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
      const personal = row.original;

      return <AccionesPersonal personal={personal} />;
    },
  },
];
