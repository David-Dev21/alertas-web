'use client';

import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, MoreHorizontal, CheckCircle, XCircle, Eye, Trash2, Clock } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Victima } from '@/types/victimas/Victima';
import { useAccionesVictimas } from '@/hooks/victimas/useAccionesVictimas';
import { formatearFechaHora } from '@/lib/utils';

function AccionesVictima({ victima }: { victima: Victima }) {
  const { validarTelefono, eliminarVictima, cargandoAccion } = useAccionesVictimas();

  const manejarValidarTelefono = async () => {
    await validarTelefono(victima.id);
    // La tabla se refrescará automáticamente
  };

  const manejarEliminar = async () => {
    if (confirm('¿Estás seguro de que deseas eliminar esta víctima?')) {
      await eliminarVictima(victima.id);
      // La tabla se refrescará automáticamente
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0" disabled={cargandoAccion}>
          <span className="sr-only">Abrir menú</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Acciones</DropdownMenuLabel>
        <DropdownMenuItem onClick={() => navigator.clipboard.writeText(victima.id)}>
          <Eye className="mr-2 h-4 w-4" />
          Copiar ID
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Eye className="mr-2 h-4 w-4" />
          Ver detalles
        </DropdownMenuItem>
        {!victima.telefonoValidado && (
          <DropdownMenuItem onClick={manejarValidarTelefono}>
            <CheckCircle className="mr-2 h-4 w-4" />
            Validar teléfono
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={manejarEliminar} className="text-destructive">
          <Trash2 className="mr-2 h-4 w-4" />
          Eliminar
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export const columnasVictimas: ColumnDef<Victima>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => <Checkbox checked={row.getIsSelected()} onCheckedChange={(value) => row.toggleSelected(!!value)} aria-label="Select row" />,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'cedulaIdentidad',
    header: 'Cédula de Identidad',
    cell: ({ row }) => <div className="font-medium">{row.getValue('cedulaIdentidad')}</div>,
  },
  {
    accessorKey: 'nombres',
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Nombres
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => <div className="font-medium">{row.getValue('nombres')}</div>,
  },
  {
    accessorKey: 'apellidos',
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Apellidos
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => <div className="font-medium">{row.getValue('apellidos')}</div>,
  },
  {
    accessorKey: 'celular',
    header: 'Celular',
    cell: ({ row }) => <div className="font-mono">{row.getValue('celular')}</div>,
  },
  {
    accessorKey: 'correo',
    header: 'Correo',
    cell: ({ row }) => <div className="lowercase">{row.getValue('correo')}</div>,
  },
  {
    accessorKey: 'telefonoValidado',
    header: 'Estado',
    cell: ({ row }) => {
      const validado = row.getValue('telefonoValidado') as boolean;
      return <Badge variant={validado ? 'default' : 'secondary'}>{validado ? 'Validado' : 'Sin Validar'}</Badge>;
    },
  },
  {
    accessorKey: 'fechaRegistro',
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Fecha de Registro
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const fecha = row.getValue('fechaRegistro') as string;
      const { hora, fecha: fechaFormateada } = formatearFechaHora(fecha);
      return (
        <div className="text-sm">
          <div className="flex items-center gap-1">
            <Clock className="size-3" />
            <div className="font-medium">{hora}</div>
          </div>
          <div className="text-muted-foreground">{fechaFormateada}</div>
        </div>
      );
    },
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => {
      const victima = row.original;

      return <AccionesVictima victima={victima} />;
    },
  },
];
