'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { useAgresores } from '@/hooks/alertas/useAgresores';

interface ModalAgregarAgresorProps {
  abierto: boolean;
  onCerrar: () => void;
  idAlerta: string;
  cedulaInicial?: string;
  onAgresorCreado?: (datos: { id: string; cedulaIdentidad: string; nombres: string; apellidos: string; parentesco: string }) => void;
}

interface DatosAgresor {
  cedulaIdentidad: string;
  nombres: string;
  apellidos: string;
  relacionVictima: string;
}

export function ModalAgregarAgresor({ abierto, onCerrar, cedulaInicial = '', onAgresorCreado }: ModalAgregarAgresorProps) {
  const { crearAgresor, creandoAgresor } = useAgresores();
  const [datosAgresor, setDatosAgresor] = useState<DatosAgresor>({
    cedulaIdentidad: cedulaInicial,
    nombres: '',
    apellidos: '',
    relacionVictima: '',
  });

  // Actualizar la cédula cuando cambie cedulaInicial o se abra el modal
  useEffect(() => {
    if (abierto && cedulaInicial) {
      setDatosAgresor((prev) => ({
        ...prev,
        cedulaIdentidad: cedulaInicial,
      }));
    } else if (!abierto) {
      // Limpiar formulario cuando se cierra el modal
      setDatosAgresor({
        cedulaIdentidad: '',
        nombres: '',
        apellidos: '',
        relacionVictima: '',
      });
    }
  }, [abierto, cedulaInicial]);

  const manejarCambio = (campo: keyof DatosAgresor, valor: string) => {
    setDatosAgresor((prev) => ({
      ...prev,
      [campo]: valor,
    }));
  };

  const manejarSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const datosCrear = {
      cedulaIdentidad: datosAgresor.cedulaIdentidad,
      nombres: datosAgresor.nombres,
      apellidos: datosAgresor.apellidos,
      parentesco: datosAgresor.relacionVictima,
    };

    const agresorCreado = await crearAgresor(datosCrear);

    if (agresorCreado) {
      onAgresorCreado?.({
        id: agresorCreado.id,
        cedulaIdentidad: datosCrear.cedulaIdentidad,
        nombres: datosCrear.nombres,
        apellidos: datosCrear.apellidos,
        parentesco: datosCrear.parentesco,
      });
      onCerrar();

      // Limpiar formulario
      setDatosAgresor({
        cedulaIdentidad: '',
        nombres: '',
        apellidos: '',
        relacionVictima: '',
      });
    }
  };

  const puedeEnviar = () => {
    return datosAgresor.nombres.trim() !== '' && datosAgresor.apellidos.trim() !== '' && datosAgresor.cedulaIdentidad.trim() !== '';
  };

  return (
    <Dialog open={abierto} onOpenChange={onCerrar}>
      <DialogContent className="sm:max-w-[500px] z-[11000] data-[state=open]:z-[11000]">
        <DialogHeader>
          <DialogTitle>Agregar Agresor</DialogTitle>
          <DialogDescription>Complete los datos del agresor identificado en la alerta.</DialogDescription>
        </DialogHeader>

        {cedulaInicial && (
          <div className="rounded-md border p-4 mb-4 bg-muted/50">
            <h5 className="text-sm font-medium mb-2">Agresor no encontrado</h5>
            <p className="text-sm text-muted-foreground">
              No se encontró un agresor con la cédula <strong>{cedulaInicial}</strong>
            </p>
          </div>
        )}

        <form onSubmit={manejarSubmit}>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="cedula-agresor">Cédula de Identidad *</Label>
              <Input
                id="cedula-agresor"
                value={datosAgresor.cedulaIdentidad}
                onChange={(e) => manejarCambio('cedulaIdentidad', e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nombres-agresor">Nombres *</Label>
                <Input id="nombres-agresor" value={datosAgresor.nombres} onChange={(e) => manejarCambio('nombres', e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="apellidos-agresor">Apellidos *</Label>
                <Input id="apellidos-agresor" value={datosAgresor.apellidos} onChange={(e) => manejarCambio('apellidos', e.target.value)} required />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="relacion-agresor">Relación con la Víctima</Label>
              <Input
                id="relacion-agresor"
                value={datosAgresor.relacionVictima}
                onChange={(e) => manejarCambio('relacionVictima', e.target.value)}
                placeholder="Ej: Pareja, Familiar, Conocido..."
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onCerrar}>
              Cancelar
            </Button>
            <Button type="submit" disabled={creandoAgresor || !puedeEnviar()}>
              {creandoAgresor ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Agregando...
                </>
              ) : (
                'Agregar Agresor'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
