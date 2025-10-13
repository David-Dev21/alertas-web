"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal, Eye, CheckCircle, Clock } from "lucide-react";

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
import { SolicitudCancelacion, EstadoSolicitudCancelacion } from "@/types/response/solicitudes-cancelacion";
import { useDetalleSolicitudCancelacion } from "@/hooks/solicitudes-cancelacion/useDetalleSolicitudCancelacion";
import { ModalDetallesSolicitud } from "./ModalDetallesSolicitud";
import { formatearFechaUTC } from "@/lib/utils";

function AccionesSolicitudCancelacion({
  solicitud,
  onAccionSolicitud,
}: {
  solicitud: SolicitudCancelacion;
  onAccionSolicitud?: (solicitud: SolicitudCancelacion) => void;
}) {
  const { modalAbierto, detalle, cargando, error, verDetalles, cerrarModal } = useDetalleSolicitudCancelacion();

  const manejarAccion = () => {
    onAccionSolicitud?.(solicitud);
  };

  const manejarVerDetalles = () => {
    verDetalles(solicitud.id);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Abrir menú</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Acciones</DropdownMenuLabel>
          {solicitud.estadoSolicitud === "PENDIENTE" && onAccionSolicitud && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={manejarAccion}>
                <CheckCircle className="mr-2 h-4 w-4" />
                Aprobar/Rechazar
              </DropdownMenuItem>
            </>
          )}
          {solicitud.estadoSolicitud !== "PENDIENTE" && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={manejarVerDetalles} disabled={cargando}>
                <Eye className="mr-2 h-4 w-4" />
                {cargando ? "Cargando..." : "Ver Detalles"}
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <ModalDetallesSolicitud abierto={modalAbierto} onCerrar={cerrarModal} detalle={detalle} cargando={cargando} error={error} />
    </>
  );
}

function EstadoBadge({ estado }: { estado: EstadoSolicitudCancelacion }) {
  const colores: Record<EstadoSolicitudCancelacion, string> = {
    PENDIENTE: "bg-red-900 text-white",
    APROBADA: "bg-green-900 text-white",
    RECHAZADA: "bg-orange-900 text-white",
  };

  return <Badge className={colores[estado]}>{estado}</Badge>;
}

export const columnasSolicitudesCancelacion: ColumnDef<SolicitudCancelacion>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Seleccionar todos"
      />
    ),
    cell: ({ row }) => (
      <Checkbox checked={row.getIsSelected()} onCheckedChange={(value) => row.toggleSelected(!!value)} aria-label="Seleccionar fila" />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorFn: (row) => row.victima.cedulaIdentidad,
    id: "cedulaIdentidad",
    header: "Cédula de Identidad",
    cell: ({ getValue }) => <div className="text-sm text-muted-foreground">{getValue() as string}</div>,
    filterFn: (row, value) => {
      const cedula = row.original.victima.cedulaIdentidad;
      return cedula.toLowerCase().includes(value.toLowerCase());
    },
  },
  {
    accessorFn: (row) => row.victima.nombres,
    id: "nombres",
    header: "Nombres",
    cell: ({ getValue }) => <div className="font-medium">{getValue() as string}</div>,
    filterFn: (row, value) => {
      const nombre = row.original.victima.nombres;
      return nombre.toLowerCase().includes(value.toLowerCase());
    },
  },
  {
    accessorFn: (row) => row.victima.apellidos,
    id: "apellidos",
    header: "Apellidos",
    cell: ({ getValue }) => <div className="font-medium">{getValue() as string}</div>,
    filterFn: (row, value) => {
      const apellido = row.original.victima.apellidos;
      return apellido.toLowerCase().includes(value.toLowerCase());
    },
  },

  {
    accessorFn: (row) => row.victima.celular,
    id: "numeroCelular",
    header: "Número Celular",
    cell: ({ getValue }) => <div className="text-sm text-muted-foreground">{getValue() as string}</div>,
    filterFn: (row, value) => {
      const numero = row.original.victima.celular;
      return numero.includes(value);
    },
  },
  {
    accessorKey: "estadoSolicitud",
    header: "Estado",
    cell: ({ row }) => {
      const estado = row.getValue("estadoSolicitud") as EstadoSolicitudCancelacion;
      return <EstadoBadge estado={estado} />;
    },
  },
  {
    accessorKey: "fechaSolicitud",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Fecha Solicitud
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const fecha = new Date(row.getValue("fechaSolicitud") as string);
      const fechaFormateada = formatearFechaUTC(fecha.toISOString());
      return (
        <div className="text-sm">
          <div className="text-muted-foreground">{fechaFormateada}</div>
        </div>
      );
    },
  },
  {
    id: "acciones",
    cell: ({ row }) => {
      const solicitud = row.original;
      return <AccionesSolicitudCancelacion solicitud={solicitud} />;
    },
  },
];

// Función para crear columnas con callback dinámico
export const crearColumnasSolicitudesCancelacion = (onAccionSolicitud?: (solicitud: SolicitudCancelacion) => void) => {
  return columnasSolicitudesCancelacion.map((columna) => {
    if (columna.id === "acciones") {
      return {
        ...columna,
        cell: ({ row }: any) => {
          const solicitud = row.original;
          return <AccionesSolicitudCancelacion solicitud={solicitud} onAccionSolicitud={onAccionSolicitud} />;
        },
      };
    }
    return columna;
  });
};
