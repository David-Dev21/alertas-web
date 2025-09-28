'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus } from 'lucide-react';
import { useAccionesVictimas } from '@/hooks/victimas/useAccionesVictimas';
import type { CrearVictima } from '@/types/victimas/Victima';

interface BotonNuevaVictimaProps {
  onVictimaCreada?: () => void;
}

export function BotonNuevaVictima({ onVictimaCreada }: BotonNuevaVictimaProps) {
  const [abierto, setAbierto] = useState(false);
  const { crearVictima, cargandoAccion, error } = useAccionesVictimas();

  const [formData, setFormData] = useState({
    nombres: '',
    apellidos: '',
    cedulaIdentidad: '',
    celular: '',
    correo: '',
    fechaNacimiento: '',
    idMunicipio: 1,
    direccion: {
      zona: '',
      calle: '',
      numero: '',
      referencia: '',
    },
    telefonoValidado: false,
    contactosEmergencia: [
      {
        parentesco: '',
        nombreCompleto: '',
        celular: '',
      },
    ],
  });

  const manejarSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const nuevaVictima: CrearVictima = {
      ...formData,
      contactosEmergencia: formData.contactosEmergencia.filter((contacto) => contacto.nombreCompleto.trim() !== ''),
    };

    const resultado = await crearVictima(nuevaVictima);

    if (resultado) {
      setAbierto(false);
      setFormData({
        nombres: '',
        apellidos: '',
        cedulaIdentidad: '',
        celular: '',
        correo: '',
        fechaNacimiento: '',
        idMunicipio: 1,
        direccion: {
          zona: '',
          calle: '',
          numero: '',
          referencia: '',
        },
        telefonoValidado: false,
        contactosEmergencia: [
          {
            parentesco: '',
            nombreCompleto: '',
            celular: '',
          },
        ],
      });
      onVictimaCreada?.();
    }
  };

  const manejarCambio = (campo: string, valor: string) => {
    if (campo.startsWith('direccion.')) {
      const campoDireccion = campo.split('.')[1];
      setFormData((prev) => ({
        ...prev,
        direccion: {
          ...prev.direccion,
          [campoDireccion]: valor,
        },
      }));
    } else if (campo.startsWith('contacto.')) {
      const campoContacto = campo.split('.')[1];
      setFormData((prev) => ({
        ...prev,
        contactosEmergencia: [
          {
            ...prev.contactosEmergencia[0],
            [campoContacto]: valor,
          },
        ],
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [campo]: valor,
      }));
    }
  };

  return (
    <Dialog open={abierto} onOpenChange={setAbierto}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Nueva Víctima
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Nueva Víctima</DialogTitle>
          <DialogDescription>Agrega una nueva víctima al sistema. Completa todos los campos requeridos.</DialogDescription>
        </DialogHeader>

        <form onSubmit={manejarSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nombres">Nombres *</Label>
                <Input id="nombres" value={formData.nombres} onChange={(e) => manejarCambio('nombres', e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="apellidos">Apellidos *</Label>
                <Input id="apellidos" value={formData.apellidos} onChange={(e) => manejarCambio('apellidos', e.target.value)} required />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cedula">Cédula de Identidad *</Label>
                <Input id="cedula" value={formData.cedulaIdentidad} onChange={(e) => manejarCambio('cedulaIdentidad', e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="celular">Celular *</Label>
                <Input id="celular" value={formData.celular} onChange={(e) => manejarCambio('celular', e.target.value)} required />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="correo">Correo Electrónico</Label>
                <Input id="correo" type="email" value={formData.correo} onChange={(e) => manejarCambio('correo', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fechaNacimiento">Fecha de Nacimiento</Label>
                <Input
                  id="fechaNacimiento"
                  type="date"
                  value={formData.fechaNacimiento}
                  onChange={(e) => manejarCambio('fechaNacimiento', e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Dirección</Label>
              <div className="grid grid-cols-2 gap-2">
                <Input placeholder="Zona" value={formData.direccion.zona} onChange={(e) => manejarCambio('direccion.zona', e.target.value)} />
                <Input placeholder="Calle" value={formData.direccion.calle} onChange={(e) => manejarCambio('direccion.calle', e.target.value)} />
                <Input placeholder="Número" value={formData.direccion.numero} onChange={(e) => manejarCambio('direccion.numero', e.target.value)} />
                <Input
                  placeholder="Referencia"
                  value={formData.direccion.referencia}
                  onChange={(e) => manejarCambio('direccion.referencia', e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Contacto de Emergencia</Label>
              <div className="grid grid-cols-3 gap-2">
                <Input
                  placeholder="Parentesco"
                  value={formData.contactosEmergencia[0]?.parentesco || ''}
                  onChange={(e) => manejarCambio('contacto.parentesco', e.target.value)}
                />
                <Input
                  placeholder="Nombre Completo"
                  value={formData.contactosEmergencia[0]?.nombreCompleto || ''}
                  onChange={(e) => manejarCambio('contacto.nombreCompleto', e.target.value)}
                />
                <Input
                  placeholder="Celular"
                  value={formData.contactosEmergencia[0]?.celular || ''}
                  onChange={(e) => manejarCambio('contacto.celular', e.target.value)}
                />
              </div>
            </div>
          </div>

          {error && <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive mb-4">{error}</div>}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setAbierto(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={cargandoAccion}>
              {cargandoAccion ? 'Guardando...' : 'Guardar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
