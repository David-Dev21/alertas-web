import { useState } from 'react';
import { alertasService } from '@/services/alertas/alertasService';
import { toast } from 'sonner';

interface AgresorEncontrado {
  id: string;
  cedulaIdentidad: string;
  nombreCompleto: string;
  parentesco: string;
}

interface DatosCrearAgresor {
  cedulaIdentidad: string;
  nombres: string;
  apellidos: string;
  parentesco: string;
}

export const useAgresores = () => {
  const [buscandoAgresor, setBuscandoAgresor] = useState(false);
  const [creandoAgresor, setCreandoAgresor] = useState(false);

  const buscarAgresor = async (cedula: string): Promise<AgresorEncontrado | null> => {
    if (!cedula.trim()) return null;

    setBuscandoAgresor(true);
    try {
      const response = await alertasService.buscarAgresor(cedula.trim());

      if (response.exito && response.datos) {
        toast.success('Agresor encontrado exitosamente');
        return response.datos;
      } else {
        toast.info('No se encontró un agresor con esa cédula');
        return null;
      }
    } catch (error) {
      toast.error('Error al buscar el agresor');
      console.error('Error al buscar agresor:', error);
      return null;
    } finally {
      setBuscandoAgresor(false);
    }
  };

  const crearAgresor = async (datos: DatosCrearAgresor): Promise<AgresorEncontrado | null> => {
    setCreandoAgresor(true);
    try {
      const response = await alertasService.crearAgresor(datos);

      if (response.exito && response.datos) {
        toast.success('Agresor creado exitosamente');
        return {
          id: response.datos.id,
          cedulaIdentidad: datos.cedulaIdentidad,
          nombreCompleto: `${datos.nombres} ${datos.apellidos}`,
          parentesco: datos.parentesco,
        };
      } else {
        toast.error(response.mensaje || 'Error al crear el agresor');
        return null;
      }
    } catch (error) {
      toast.error('Error al crear el agresor');
      console.error('Error al crear agresor:', error);
      return null;
    } finally {
      setCreandoAgresor(false);
    }
  };

  return {
    buscarAgresor,
    crearAgresor,
    buscandoAgresor,
    creandoAgresor,
  };
};
