"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ChevronDown, Search, RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface DataTableProps<TData, TValue> {
  columnas: ColumnDef<TData, TValue>[];
  datos: TData[];
  cargando?: boolean;
  paginacion?: {
    paginaActual: number;
    totalPaginas: number;
    totalElementos: number;
    elementosPorPagina: number;
  };
  onPaginaAnterior?: () => void;
  onPaginaSiguiente?: () => void;
  onIrAPagina?: (pagina: number) => void;
  onCambiarLimite?: (limite: number) => void;
  onBuscar?: (termino: string) => void;
  onRefrescar?: () => void;
  onFiltrarEstado?: (estado: string) => void;
  estadoFiltro?: string;
}

export function TablaSolicitudesCancelacion<TData, TValue>({
  columnas,
  datos,
  cargando = false,
  paginacion,
  onPaginaAnterior,
  onPaginaSiguiente,
  onIrAPagina,
  onCambiarLimite,
  onBuscar,
  onRefrescar,
  onFiltrarEstado,
  estadoFiltro,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [busqueda, setBusqueda] = React.useState("");

  const manejarBusqueda = (valor: string) => {
    setBusqueda(valor);
    onBuscar?.(valor);
  };

  const table = useReactTable({
    data: datos,
    columns: columnas,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    enableRowSelection: true,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <div className="flex items-center space-x-2 flex-1">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por cédula, nombres o apellidos..."
              value={busqueda}
              onChange={(event) => manejarBusqueda(event.target.value)}
              className="pl-8 w-80"
            />
          </div>
          <Select value={estadoFiltro || "TODOS"} onValueChange={onFiltrarEstado}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filtrar por estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="TODOS">Todos los estados</SelectItem>
              <SelectItem value="PENDIENTE">Pendiente</SelectItem>
              <SelectItem value="APROBADA">Aprobada</SelectItem>
              <SelectItem value="RECHAZADA">Rechazada</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={onRefrescar} disabled={cargando}>
            <RefreshCw className={`mr-2 h-4 w-4 ${cargando ? "animate-spin" : ""}`} />
            Refrescar
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                Columnas <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) => column.toggleVisibility(!!value)}
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {cargando ? (
              <TableRow>
                <TableCell colSpan={columnas.length} className="h-24 text-center">
                  <div className="flex items-center justify-center">
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Cargando solicitudes...
                  </div>
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columnas.length} className="h-24 text-center">
                  No se encontraron solicitudes de cancelación.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {paginacion && (
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center space-x-2">
            <p className="text-sm text-muted-foreground">
              Mostrando {Math.min(paginacion.elementosPorPagina, paginacion.totalElementos)} de {paginacion.totalElementos} registros
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <p className="text-sm font-medium">Filas por página</p>
            <Select value={`${paginacion.elementosPorPagina}`} onValueChange={(valor) => onCambiarLimite?.(Number(valor))}>
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent side="top">
                {[10, 20, 30, 40, 50].map((tamanoPagina) => (
                  <SelectItem key={tamanoPagina} value={`${tamanoPagina}`}>
                    {tamanoPagina}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (paginacion.paginaActual > 1 && !cargando) {
                        onPaginaAnterior?.();
                      }
                    }}
                    className={paginacion.paginaActual <= 1 || cargando ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>

                {/* Números de página */}
                {(() => {
                  const items = [];
                  const totalPaginas = paginacion.totalPaginas;
                  const paginaActual = paginacion.paginaActual;

                  // Siempre mostrar primera página
                  if (totalPaginas > 0) {
                    items.push(
                      <PaginationItem key={1}>
                        <PaginationLink
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            if (!cargando && onIrAPagina) onIrAPagina(1);
                          }}
                          isActive={paginaActual === 1}
                        >
                          1
                        </PaginationLink>
                      </PaginationItem>
                    );
                  }

                  // Agregar ellipsis si es necesario al principio
                  if (paginaActual > 3) {
                    items.push(
                      <PaginationItem key="ellipsis-start">
                        <PaginationEllipsis />
                      </PaginationItem>
                    );
                  }

                  // Páginas alrededor de la actual
                  const start = Math.max(2, paginaActual - 1);
                  const end = Math.min(totalPaginas - 1, paginaActual + 1);

                  for (let i = start; i <= end; i++) {
                    if (i !== 1 && i !== totalPaginas) {
                      items.push(
                        <PaginationItem key={i}>
                          <PaginationLink
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              if (!cargando && onIrAPagina) onIrAPagina(i);
                            }}
                            isActive={paginaActual === i}
                          >
                            {i}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    }
                  }

                  // Agregar ellipsis si es necesario al final
                  if (paginaActual < totalPaginas - 2) {
                    items.push(
                      <PaginationItem key="ellipsis-end">
                        <PaginationEllipsis />
                      </PaginationItem>
                    );
                  }

                  // Siempre mostrar última página si hay más de una
                  if (totalPaginas > 1) {
                    items.push(
                      <PaginationItem key={totalPaginas}>
                        <PaginationLink
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            if (!cargando && onIrAPagina) onIrAPagina(totalPaginas);
                          }}
                          isActive={paginaActual === totalPaginas}
                        >
                          {totalPaginas}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  }

                  return items;
                })()}

                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (paginacion.paginaActual < paginacion.totalPaginas && !cargando) {
                        onPaginaSiguiente?.();
                      }
                    }}
                    className={paginacion.paginaActual >= paginacion.totalPaginas || cargando ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </div>
      )}
    </div>
  );
}
