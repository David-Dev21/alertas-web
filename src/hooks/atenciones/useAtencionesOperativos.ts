import { useState } from 'react';
import { atencionesService } from '@/services/atenciones/atencionesService';
import { CrearAtencionRequest, AtencionResponse } from '@/types/atenciones/Atencion';
import { useUbicacionesOperativosStore } from '@/stores/alertas/ubicacionesOperativosStore';
import { toast } from 'sonner';

export function useAtencionesOperativos() {
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { limpiarUbicacionesFuncionario } = useUbicacionesOperativosStore();

  const crearAtencion = async (data: CrearAtencionRequest): Promise<AtencionResponse | null> => {
    setCargando(true);
    setError(null);

    try {
      const atencion = await atencionesService.crearAtencion(data);

      // Limpiar ubicaciones específicas del funcionario asignado
      data.funcionarios.forEach((funcionario) => {
        limpiarUbicacionesFuncionario(data.id, funcionario.idUsuarioOperativo);
      });

      toast.success('Operativo asignado exitosamente');
      return atencion;
    } catch (err: any) {
      const mensajeError = err?.response?.data?.mensaje || err?.message || 'Error al asignar operativo';
      setError(mensajeError);
      toast.error(mensajeError);
      return null;
    } finally {
      setCargando(false);
    }
  };

  return {
    crearAtencion,
    cargando,
    error,
  };
}
