import { useState } from "react";
import { alertasService } from "@/services/alertas/alertasService";
import { toast } from "sonner";

interface AgresorEncontrado {
  id: string;
  cedulaIdentidad: string;
  nombreCompleto: string;
  parentesco: string;
}

interface DatosCrearAgresorRequest {
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
      toast.success("Agresor encontrado exitosamente");
      return response;
    } catch (error) {
      toast.info("No se encontró un agresor con esa cédula");
      console.error("Error al buscar agresor:", error);
      return null;
    } finally {
      setBuscandoAgresor(false);
    }
  };

  const crearAgresor = async (datos: DatosCrearAgresorRequest): Promise<AgresorEncontrado | null> => {
    setCreandoAgresor(true);
    try {
      const response = await alertasService.crearAgresor(datos);
      toast.success("Agresor creado exitosamente");
      return {
        id: response.id,
        cedulaIdentidad: datos.cedulaIdentidad,
        nombreCompleto: `${datos.nombres} ${datos.apellidos}`,
        parentesco: datos.parentesco,
      };
    } catch (error) {
      toast.error("Error al crear el agresor");
      console.error("Error al crear agresor:", error);
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
