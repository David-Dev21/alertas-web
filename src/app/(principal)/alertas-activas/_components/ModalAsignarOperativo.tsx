'use client';
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { UserPlus, Loader2, AlertCircle } from 'lucide-react';
import { RolAtencion, CrearAtencionRequest } from '@/types/atenciones/Atencion';
import { useAtencionesOperativos } from '@/hooks/atenciones/useAtencionesOperativos';
import { useAuth } from '@/hooks/autenticacion/useAutenticacion';

interface Turno {
  id: string;
  nombre: string;
  inicioHora: string; // HH:MM:SS
  finHora: string; // HH:MM:SS
}

const TURNOS: Turno[] = [
  { id: '1', nombre: '1er Turno (07:00 - 13:00)', inicioHora: '07:00:00', finHora: '13:00:00' },
  { id: '2', nombre: '2do Turno (13:00 - 19:00)', inicioHora: '13:00:00', finHora: '19:00:00' },
  { id: '3', nombre: '3er Turno (19:00 - 01:00)', inicioHora: '19:00:00', finHora: '01:00:00' },
  { id: '4', nombre: '4to Turno (01:00 - 07:00)', inicioHora: '01:00:00', finHora: '07:00:00' },
  { id: '5', nombre: 'Turno 24 horas (07:00 - 07:00)', inicioHora: '07:00:00', finHora: '07:00:00' },
  { id: '6', nombre: 'Turno 48 horas (07:00 - 07:00)', inicioHora: '07:00:00', finHora: '07:00:00' },
];

function calcularTimestampsTurno(turnoId: string): { turnoInicio: string; turnoFin: string } {
  const turno = TURNOS.find((t) => t.id === turnoId);
  if (!turno) throw new Error('Turno no encontrado');

  const now = new Date();
  const [inicioH, inicioM, inicioS] = turno.inicioHora.split(':').map(Number);
  const [finH, finM, finS] = turno.finHora.split(':').map(Number);

  const turnoInicio = new Date(now.getFullYear(), now.getMonth(), now.getDate(), inicioH, inicioM, inicioS);

  let turnoFin = new Date(now.getFullYear(), now.getMonth(), now.getDate(), finH, finM, finS);

  // Si fin es menor que inicio, significa que cruza medianoche, sumar 1 día
  if (finH < inicioH || (finH === inicioH && finM < inicioM)) {
    turnoFin.setDate(turnoFin.getDate() + 1);
  }

  // Para turno 24 horas, sumar 1 día a fin
  if (turnoId === '5') {
    turnoFin.setDate(turnoFin.getDate() + 1);
  }

  // Para turno 48 horas, sumar 2 días a fin
  if (turnoId === '6') {
    turnoFin.setDate(turnoFin.getDate() + 2);
  }

  return {
    turnoInicio: turnoInicio.toISOString(),
    turnoFin: turnoFin.toISOString(),
  };
}

interface ModalAsignarOperativoProps {
  idAlerta: string;
  idUsuarioOperativo: string;
  ubicacionOperativo: {
    coordinates: [number, number];
    timestamp: string;
    accuracy?: number;
  };
  nombreOperativo?: string;
  onAsignacionExitosa?: () => void;
}

export function ModalAsignarOperativo({
  idAlerta,
  idUsuarioOperativo,
  ubicacionOperativo,
  nombreOperativo,
  onAsignacionExitosa,
}: ModalAsignarOperativoProps) {
  const [abierto, setAbierto] = useState(false);
  const [siglaVehiculo, setSiglaVehiculo] = useState('');
  const [siglaRadio, setSiglaRadio] = useState('');
  const [rolAtencion, setRolAtencion] = useState<RolAtencion | null>(null);
  const [turnoId, setTurnoId] = useState('1');
  const [erroresValidacion, setErroresValidacion] = useState<string[]>([]);

  const { crearAtencion, cargando, error } = useAtencionesOperativos();
  const { user } = useAuth();

  const manejarAsignacion = async () => {
    const errores: string[] = [];

    if (!siglaVehiculo.trim()) {
      errores.push('La sigla del vehículo es requerida');
    }

    if (!siglaRadio.trim()) {
      errores.push('La sigla de radio es requerida');
    }

    if (!rolAtencion) {
      errores.push('Debe seleccionar un rol de atención');
    }

    if (errores.length > 0) {
      setErroresValidacion(errores);
      return;
    }

    setErroresValidacion([]);

    if (!user?.userId) {
      console.error('No hay usuario autenticado');
      return;
    }

    const { turnoInicio, turnoFin } = calcularTimestampsTurno(turnoId);

    const datosAtencion: CrearAtencionRequest = {
      idAlerta,
      idUsuarioAdmin: user.userId,
      siglaVehiculo: siglaVehiculo.trim(),
      siglaRadio: siglaRadio.trim(),
      funcionarios: [
        {
          idUsuarioOperativo,
          rolAtencion: rolAtencion!,
          ubicacion: {
            type: 'Point',
            coordinates: ubicacionOperativo.coordinates,
            timestamp: ubicacionOperativo.timestamp,
            precision: ubicacionOperativo.accuracy || 10,
          },
          turnoInicio,
          turnoFin,
        },
      ],
    };

    const resultado = await crearAtencion(datosAtencion);
    if (resultado) {
      setAbierto(false);
      setSiglaVehiculo('');
      setSiglaRadio('');
      setRolAtencion(null);
      setTurnoId('1');
      onAsignacionExitosa?.();
    }
  };

  return (
    <Dialog
      open={abierto}
      onOpenChange={(open) => {
        setAbierto(open);
        if (open) {
          setErroresValidacion([]);
        }
      }}
    >
      <DialogTrigger asChild>
        <Button size="sm" variant="default" className="w-full">
          <UserPlus className="w-4 h-4 mr-1" />
          Asignar Operativo
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md z-[10000] data-[state=open]:z-[10000]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="w-5 h-5" />
            Asignar Operativo a Alerta
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {(erroresValidacion.length > 0 || error) && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
              <div className="flex items-center gap-2 text-destructive mb-2">
                <AlertCircle className="w-4 h-4" />
                <span className="font-medium text-sm">Errores de validación</span>
              </div>
              <ul className="text-sm text-destructive space-y-1">
                {erroresValidacion.map((error, index) => (
                  <li key={index}>• {error}</li>
                ))}
                {error && <li>• {error}</li>}
              </ul>
            </div>
          )}

          <div className="space-y-2">
            <Label className="text-sm font-medium">Información del Operativo</Label>
            <div className="bg-muted/50 p-3 rounded-lg space-y-1">
              <div className="text-sm">
                <span className="font-medium">ID:</span> {idUsuarioOperativo}
              </div>
              {nombreOperativo && (
                <div className="text-sm">
                  <span className="font-medium">Nombre:</span> {nombreOperativo}
                </div>
              )}
              <div className="text-sm">
                <span className="font-medium">Ubicación:</span> {ubicacionOperativo.coordinates[1].toFixed(6)},{' '}
                {ubicacionOperativo.coordinates[0].toFixed(6)}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="siglaVehiculo">Sigla Vehículo *</Label>
              <Input
                id="siglaVehiculo"
                placeholder="ej: VEH-001"
                value={siglaVehiculo}
                onChange={(e) => setSiglaVehiculo(e.target.value)}
                disabled={cargando}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="siglaRadio">Sigla Radio *</Label>
              <Input
                id="siglaRadio"
                placeholder="ej: RAD-001"
                value={siglaRadio}
                onChange={(e) => setSiglaRadio(e.target.value)}
                disabled={cargando}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-3">
              <Label className="text-sm font-medium">Rol de Atención *</Label>
              <RadioGroup value={rolAtencion || ''} onValueChange={(value) => setRolAtencion(value as RolAtencion)} disabled={cargando}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value={RolAtencion.ENCARGADO} id="encargado" />
                  <Label htmlFor="encargado" className="text-sm">
                    Encargado
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value={RolAtencion.APOYO} id="apoyo" />
                  <Label htmlFor="apoyo" className="text-sm">
                    Apoyo
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label htmlFor="turnoServicio">Turno de Servicio</Label>
              <Select value={turnoId} onValueChange={setTurnoId} disabled={cargando}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TURNOS.map((turno) => (
                    <SelectItem key={turno.id} value={turno.id}>
                      {turno.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => setAbierto(false)} disabled={cargando}>
            Cancelar
          </Button>
          <Button onClick={manejarAsignacion} disabled={cargando} className="min-w-[120px]">
            {cargando ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Asignando...
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4 mr-2" />
                Asignar
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
