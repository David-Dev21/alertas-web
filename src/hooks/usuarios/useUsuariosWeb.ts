import { useState, useEffect, useCallback } from "react";
import { usuariosWebService, UsuarioWeb } from "@/services/usuariosWebService";
import { EstadoCarga, RespuestaPaginada } from "@/types/common.types";

export interface EstadoUsuariosWeb extends EstadoCarga {
  usuarios: UsuarioWeb[];
  paginacion: RespuestaPaginada<UsuarioWeb>["paginacion"];
}

export interface ParametrosConsultaUsuariosWeb {
  pagina?: number;
  limite?: number;
  busqueda?: string;
  estadoSession?: boolean;
}

export function useUsuariosWeb() {
  const [estado, setEstado] = useState<EstadoUsuariosWeb>({
    usuarios: [],
    paginacion: {
      paginaActual: 1,
      totalPaginas: 0,
      totalElementos: 0,
      elementosPorPagina: 10,
    },
    cargando: true,
    error: null,
  });

  const [parametros, setParametros] = useState<ParametrosConsultaUsuariosWeb>({
    pagina: 1,
    limite: 10,
  });

  // Función para cargar usuarios web
  const cargarUsuariosWeb = useCallback(
    async (nuevosParametros?: Partial<ParametrosConsultaUsuariosWeb>) => {
      try {
        setEstado((previo) => ({ ...previo, cargando: true, error: null }));

        const parametrosFinales = { ...parametros, ...nuevosParametros };
        const respuesta = await usuariosWebService.obtenerTodos(parametrosFinales);

        setEstado((previo) => ({
          ...previo,
          usuarios: respuesta.datos || [],
          paginacion: respuesta.paginacion || {
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
        console.error("Error al cargar usuarios web:", error);
        setEstado((previo) => ({
          ...previo,
          cargando: false,
          error: error instanceof Error ? error.message : "Error desconocido",
        }));
      }
    },
    [parametros]
  );

  // Cargar usuarios web inicialmente
  useEffect(() => {
    cargarUsuariosWeb();
  }, [cargarUsuariosWeb]);

  // Función para refrescar los datos
  const refrescar = useCallback(() => {
    cargarUsuariosWeb();
  }, [cargarUsuariosWeb]);

  // Función para cambiar de página
  const irAPagina = useCallback(
    (nuevaPagina: number) => {
      cargarUsuariosWeb({ pagina: nuevaPagina });
    },
    [cargarUsuariosWeb]
  );

  // Función para cambiar el límite de elementos por página
  const cambiarLimite = useCallback(
    (nuevoLimite: number) => {
      cargarUsuariosWeb({ limite: nuevoLimite, pagina: 1 });
    },
    [cargarUsuariosWeb]
  );

  // Función para buscar
  const buscar = useCallback(
    (termino: string) => {
      cargarUsuariosWeb({ busqueda: termino, pagina: 1 });
    },
    [cargarUsuariosWeb]
  );

  return {
    ...estado,
    parametros,
    refrescar,
    irAPagina,
    cambiarLimite,
    buscar,
    cargarUsuariosWeb,
  };
}
