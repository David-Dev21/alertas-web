import { useState } from 'react';
import { victimasService } from '@/services/victimas/victimasService';
import { Victima, CrearVictima, ActualizarVictima } from '@/types/victimas/Victima';

export function useAccionesVictimas() {
  const [cargandoAccion, setCargandoAccion] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const ejecutarAccion = async <T>(accion: () => Promise<T>, mensajeExito?: string): Promise<T | null> => {
    try {
      setCargandoAccion(true);
      setError(null);

      const resultado = await accion();

      if (mensajeExito) {
        // Aquí podrías agregar una notificación toast
        console.log(mensajeExito);
      }

      return resultado;
    } catch (error) {
      const mensaje = error instanceof Error ? error.message : 'Error desconocido';
      setError(mensaje);
      console.error('Error en acción de víctima:', error);
      return null;
    } finally {
      setCargandoAccion(false);
    }
  };

  const crearVictima = async (data: CrearVictima): Promise<Victima | null> => {
    return ejecutarAccion(() => victimasService.crear(data), 'Víctima creada exitosamente');
  };

  const actualizarVictima = async (id: string, data: ActualizarVictima): Promise<Victima | null> => {
    return ejecutarAccion(() => victimasService.actualizar(id, data), 'Víctima actualizada exitosamente');
  };

  const eliminarVictima = async (id: string): Promise<boolean | null> => {
    return ejecutarAccion(() => victimasService.eliminar(id), 'Víctima eliminada exitosamente');
  };

  const validarTelefono = async (id: string): Promise<Victima | null> => {
    return ejecutarAccion(() => victimasService.validarTelefono(id), 'Teléfono validado exitosamente');
  };

  const obtenerVictimaPorId = async (id: string): Promise<Victima | null> => {
    return ejecutarAccion(() => victimasService.obtenerPorId(id));
  };

  const limpiarError = () => {
    setError(null);
  };

  return {
    cargandoAccion,
    error,
    crearVictima,
    actualizarVictima,
    eliminarVictima,
    validarTelefono,
    obtenerVictimaPorId,
    limpiarError,
  };
}
