import { useState, useEffect } from 'react';
import { atencionesService } from '@/services/atenciones/atencionesService';
import { AtencionFuncionariosResponse } from '@/types/atenciones/Atencion';

export function useFuncionariosAsignados(idAlerta: string) {
  const [funcionarios, setFuncionarios] = useState<AtencionFuncionariosResponse['datos'] | null>(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cargarFuncionarios = async () => {
    if (!idAlerta) return;

    setCargando(true);
    setError(null);

    try {
      const datos = await atencionesService.obtenerFuncionariosAsignados(idAlerta);
      setFuncionarios(datos);
    } catch (err: any) {
      const mensajeError = err?.response?.data?.mensaje || err?.message || 'Error al cargar funcionarios asignados';
      setError(mensajeError);
      setFuncionarios(null);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarFuncionarios();
  }, [idAlerta]);

  const refrescarFuncionarios = () => {
    cargarFuncionarios();
  };

  return {
    funcionarios,
    cargando,
    error,
    refrescarFuncionarios,
  };
}
