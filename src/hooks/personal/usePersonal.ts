import { useState, useEffect, useCallback } from "react";
import { personalService, Personal, PaginacionPersonal, ObtenerPersonalResponse } from "@/services/personalService";

export interface EstadoPersonal {
  personal: Personal[];
  paginacion: PaginacionPersonal;
  cargando: boolean;
  error: string | null;
}

export interface ParametrosConsultaPersonal {
  pagina?: number;
  limite?: number;
  busqueda?: string;
  idDepartamento?: number;
}

export function usePersonal() {
  const [estado, setEstado] = useState<EstadoPersonal>({
    personal: [],
    paginacion: {
      paginaActual: 1,
      totalPaginas: 0,
      totalElementos: 0,
      elementosPorPagina: 10,
    },
    cargando: true,
    error: null,
  });

  const [parametros, setParametros] = useState<ParametrosConsultaPersonal>({
    pagina: 1,
    limite: 10,
  });

  // Función para cargar personal
  const cargarPersonal = useCallback(
    async (nuevosParametros?: Partial<ParametrosConsultaPersonal>) => {
      try {
        setEstado((previo) => ({ ...previo, cargando: true, error: null }));

        const parametrosFinales = { ...parametros, ...nuevosParametros };
        const respuesta = await personalService.obtenerTodos(parametrosFinales);

        setEstado((previo) => ({
          ...previo,
          personal: respuesta.datos?.datos?.personal || [],
          paginacion: respuesta.datos?.datos?.paginacion || {
            paginaActual: 1,
            totalPaginas: 0,
            totalElementos: 0,
            elementosPorPagina: 10,
          },
          cargando: false,
        }));

        if (nuevosParametros) {
          setParametros(parametrosFinales);
        }
      } catch (error) {
        console.error("Error al cargar personal:", error);
        setEstado((previo) => ({
          ...previo,
          cargando: false,
          error: error instanceof Error ? error.message : "Error desconocido",
        }));
      }
    },
    [parametros]
  );

  // Cargar personal inicialmente
  useEffect(() => {
    cargarPersonal();
  }, []);

  // Función para refrescar los datos
  const refrescar = useCallback(() => {
    cargarPersonal();
  }, [cargarPersonal]);

  // Función para cambiar de página
  const irAPagina = useCallback(
    (nuevaPagina: number) => {
      cargarPersonal({ pagina: nuevaPagina });
    },
    [cargarPersonal]
  );

  // Función para cambiar el límite de elementos por página
  const cambiarLimite = useCallback(
    (nuevoLimite: number) => {
      cargarPersonal({ limite: nuevoLimite, pagina: 1 });
    },
    [cargarPersonal]
  );

  // Función para buscar
  const buscar = useCallback(
    (termino: string) => {
      cargarPersonal({ busqueda: termino, pagina: 1 });
    },
    [cargarPersonal]
  );

  // Función para filtrar por departamento
  const filtrarPorDepartamento = useCallback(
    (idDepartamento: number | string) => {
      const nuevosParametros: ParametrosConsultaPersonal = { pagina: 1 };
      if (idDepartamento && idDepartamento !== "TODOS") {
        nuevosParametros.idDepartamento = Number(idDepartamento);
      }
      // Cuando es "TODOS", no se incluye idDepartamento
      cargarPersonal(nuevosParametros);
    },
    [cargarPersonal]
  );

  // Función para buscar personal (sin actualizar estado principal)
  const buscarPersonal = useCallback(async (termino: string, idDepartamento?: number) => {
    try {
      const respuesta = await personalService.buscarPersonal(termino, idDepartamento!);
      return respuesta;
    } catch (error) {
      console.error("Error al buscar personal:", error);
      throw error;
    }
  }, []);

  // Función para crear personal
  const crearPersonal = useCallback(
    async (datos: { grado: string; nombreCompleto: string; unidad: string; escalafon: string; idDepartamento: number }) => {
      try {
        setEstado((previo) => ({ ...previo, cargando: true, error: null }));
        const respuesta = await personalService.crearPersonal(datos);
        setEstado((previo) => ({ ...previo, cargando: false }));
        return respuesta;
      } catch (error) {
        console.error("Error al crear personal:", error);
        setEstado((previo) => ({
          ...previo,
          cargando: false,
          error: error instanceof Error ? error.message : "Error desconocido",
        }));
        throw error;
      }
    },
    []
  );

  // Función para actualizar personal
  const actualizarPersonal = useCallback(
    async (id: string, datos: Partial<{ grado: string; nombreCompleto: string; unidad: string; escalafon: string; idDepartamento: number }>) => {
      try {
        setEstado((previo) => ({ ...previo, cargando: true, error: null }));
        const respuesta = await personalService.actualizarPersonal(id, datos);
        setEstado((previo) => ({ ...previo, cargando: false }));
        // Refrescar la lista después de actualizar
        refrescar();
        return respuesta;
      } catch (error) {
        console.error("Error al actualizar personal:", error);
        setEstado((previo) => ({
          ...previo,
          cargando: false,
          error: error instanceof Error ? error.message : "Error desconocido",
        }));
        throw error;
      }
    },
    [refrescar]
  );

  return {
    ...estado,
    parametros,
    refrescar,
    irAPagina,
    cambiarLimite,
    buscar,
    filtrarPorDepartamento,
    cargarPersonal,
    buscarPersonal,
    crearPersonal,
    actualizarPersonal,
  };
}
