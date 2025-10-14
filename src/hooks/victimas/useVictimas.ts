import { useState, useEffect, useCallback } from "react";
import { victimasService, Victima } from "@/services/victimas/victimasService";
import { EstadoCuenta } from "@/types/enums";
import { EstadoCarga, RespuestaPaginada, ParametrosBusqueda } from "@/types/common.types";

interface ParametrosVictimas extends ParametrosBusqueda {
  estadoCuenta?: EstadoCuenta;
}

export interface EstadoVictimas extends EstadoCarga {
  datos: RespuestaPaginada<Victima> | null;
}

export function useVictimas(parametrosIniciales: ParametrosVictimas = {}) {
  const [estado, setEstado] = useState<EstadoVictimas>({
    datos: null,
    cargando: true,
    error: null,
  });

  const [parametros, setParametros] = useState<ParametrosVictimas>(parametrosIniciales);

  // Función para cargar víctimas
  const cargarVictimas = useCallback(
    async (nuevosParametros?: ParametrosVictimas) => {
      try {
        setEstado((previo) => ({ ...previo, cargando: true, error: null }));

        const parametrosFinales = { ...parametros, ...nuevosParametros };
        const respuesta = await victimasService.obtenerTodas(parametrosFinales);

        setEstado((previo) => ({
          ...previo,
          datos: respuesta,
          cargando: false,
        }));

        if (nuevosParametros) {
          setParametros(parametrosFinales);
        }
      } catch (error) {
        console.error("Error al cargar víctimas:", error);
        setEstado((previo) => ({
          ...previo,
          cargando: false,
          error: error instanceof Error ? error.message : "Error desconocido",
        }));
      }
    },
    [parametros]
  );

  // Cargar víctimas inicialmente
  useEffect(() => {
    cargarVictimas();
  }, [cargarVictimas]);

  // Función para refrescar los datos
  const refrescar = useCallback(() => {
    cargarVictimas();
  }, [cargarVictimas]);

  // Función para cambiar de página
  const irAPagina = useCallback(
    (nuevaPagina: number) => {
      cargarVictimas({ pagina: nuevaPagina });
    },
    [cargarVictimas]
  );

  // Función para cambiar el límite de elementos por página
  const cambiarLimite = useCallback(
    (nuevoLimite: number) => {
      cargarVictimas({ limite: nuevoLimite, pagina: 1 });
    },
    [cargarVictimas]
  );

  // Función para buscar
  const buscar = useCallback(
    (termino: string) => {
      cargarVictimas({ busqueda: termino, pagina: 1 });
    },
    [cargarVictimas]
  );

  // Función para filtrar por estado de cuenta
  const filtrarPorEstadoCuenta = useCallback(
    (estadoCuenta: EstadoCuenta | "TODOS") => {
      const nuevosParametros: ParametrosVictimas = { pagina: 1 };
      if (estadoCuenta !== "TODOS") {
        nuevosParametros.estadoCuenta = estadoCuenta;
      }
      cargarVictimas(nuevosParametros);
    },
    [cargarVictimas]
  );

  // Función para aplicar filtros
  const aplicarFiltros = useCallback(
    (filtros: Omit<ParametrosVictimas, "pagina" | "limite">) => {
      cargarVictimas({ ...filtros, pagina: 1 });
    },
    [cargarVictimas]
  );

  // Función para limpiar filtros
  const limpiarFiltros = useCallback(() => {
    const parametrosLimpios = {
      pagina: 1,
      limite: parametros.limite || 10,
    };
    cargarVictimas(parametrosLimpios);
  }, [cargarVictimas, parametros.limite]);

  return {
    // Datos principales
    victimas: estado.datos?.datos || [],
    paginacion: estado.datos?.paginacion || {
      paginaActual: 1,
      totalPaginas: 0,
      totalElementos: 0,
      elementosPorPagina: 10,
    },
    // Estados de carga
    cargando: estado.cargando,
    error: estado.error,
    // Funciones
    parametros,
    refrescar,
    irAPagina,
    cambiarLimite,
    buscar,
    filtrarPorEstadoCuenta,
    aplicarFiltros,
    limpiarFiltros,
    cargarVictimas,
  };
}
