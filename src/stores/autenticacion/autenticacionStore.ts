import { create } from "zustand";
import { persist } from "zustand/middleware";

interface DatosUsuario {
  nombre: string;
  apellido: string;
  nombreCompleto: string;
  correo: string;
  imagenUsuario: string;
  idUsuario: string;
  nombreUsuario: string;
  activo: boolean;
  verificado: boolean;
  creadoEn: string;
  ultimoAcceso: string;
  unidad: {
    idUnidad: number;
    abreviacion: string;
    idOrganismo: number;
    nombreCompletoOrganismo: string;
  };
  ubicacion?: {
    idDepartamento: number;
    departamento: string;
  };
}

interface DatosModulo {
  nombre: string;
  ruta: string;
  icono: string;
  orden: number;
  hijos: HijoModulo[];
}

interface HijoModulo {
  icono: string;
  nombre: string;
  orden: number;
  ruta: string;
}

interface DatosRol {
  nombre: string;
}

interface DatosSistema {
  nombre: string;
  roles: DatosRol[];
  modulos: DatosModulo[];
  permisos: any[];
}

interface AlmacenamientoAutenticacion {
  token: string | null;
  datosUsuario: DatosUsuario | null;
  datosSistema: DatosSistema | null;
  estaAutenticado: boolean;
  estaHidratado: boolean;
  establecerToken: (token: string | null) => void;
  establecerDatosUsuario: (datosUsuario: DatosUsuario | null) => void;
  establecerUbicacionUsuario: (idDepartamento: number, departamento: string) => void;
  establecerRoles: (roles: DatosRol[]) => void;
  establecerModulos: (modulos: DatosModulo[]) => void;
  establecerPermisos: (permisos: any[]) => void;
  establecerDatosSistema: (datosSistema: DatosSistema | null) => void;
  cerrarSesion: () => void;
  establecerHidratado: () => void;
}

export const useAutenticacionStore = create<AlmacenamientoAutenticacion>()(
  persist(
    (set, get) => ({
      token: null,
      datosUsuario: null,
      datosSistema: null,
      estaAutenticado: false,
      estaHidratado: false,

      establecerToken: (token: string | null) => {
        set((estado) => ({
          token,
          estaAutenticado: !!token && !!estado.datosUsuario,
        }));

        if (typeof window !== "undefined") {
          if (token) {
            localStorage.setItem("access_token", token);
          } else {
            localStorage.removeItem("access_token");
            localStorage.removeItem("refresh_token");
          }
        }
      },

      establecerDatosUsuario: (datosUsuario: DatosUsuario | null) => {
        set((estado) => ({
          datosUsuario,
          estaAutenticado: !!estado.token && !!datosUsuario,
        }));

        if (typeof window !== "undefined") {
          if (datosUsuario) {
            localStorage.setItem("datosUsuario", JSON.stringify(datosUsuario));
          } else {
            localStorage.removeItem("datosUsuario");
          }
        }
      },

      establecerUbicacionUsuario: (idDepartamento: number, departamento: string) => {
        set((estado) => {
          if (!estado.datosUsuario) return estado;

          if (estado.datosUsuario.ubicacion?.idDepartamento === idDepartamento && estado.datosUsuario.ubicacion?.departamento === departamento) {
            return estado;
          }

          const datosUsuarioActualizados = {
            ...estado.datosUsuario,
            ubicacion: {
              idDepartamento,
              departamento,
            },
          };

          if (typeof window !== "undefined") {
            localStorage.setItem("datosUsuario", JSON.stringify(datosUsuarioActualizados));
          }

          return {
            datosUsuario: datosUsuarioActualizados,
          };
        });
      },

      establecerRoles: (roles: DatosRol[]) =>
        set((estado) => ({
          datosSistema: estado.datosSistema ? { ...estado.datosSistema, roles } : { nombre: "", roles, modulos: [], permisos: [] },
        })),

      establecerModulos: (modulos: DatosModulo[]) =>
        set((estado) => ({
          datosSistema: estado.datosSistema ? { ...estado.datosSistema, modulos } : { nombre: "", roles: [], modulos, permisos: [] },
        })),

      establecerPermisos: (permisos: any[]) =>
        set((estado) => ({
          datosSistema: estado.datosSistema ? { ...estado.datosSistema, permisos } : { nombre: "", roles: [], modulos: [], permisos },
        })),

      establecerDatosSistema: (datosSistema: DatosSistema | null) => {
        set({ datosSistema });

        if (typeof window !== "undefined") {
          if (datosSistema) {
            localStorage.setItem("datosSistema", JSON.stringify(datosSistema));
          } else {
            localStorage.removeItem("datosSistema");
          }
        }
      },

      cerrarSesion: () => {
        set({
          token: null,
          datosUsuario: null,
          datosSistema: null,
          estaAutenticado: false,
        });

        if (typeof window !== "undefined") {
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
          localStorage.removeItem("datosUsuario");
          localStorage.removeItem("datosSistema");
          document.cookie = "access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
        }
      },

      establecerHidratado: () => {
        if (typeof window !== "undefined") {
          const token = localStorage.getItem("access_token");
          const datosUsuarioStr = localStorage.getItem("datosUsuario");
          const datosSistemaStr = localStorage.getItem("datosSistema");
          const datosUsuario = datosUsuarioStr ? JSON.parse(datosUsuarioStr) : null;
          const datosSistema = datosSistemaStr ? JSON.parse(datosSistemaStr) : null;

          // Actualizar todo el estado en una sola llamada
          set({
            estaHidratado: true,
            token: token || null,
            datosUsuario,
            datosSistema,
            estaAutenticado: !!(token && datosUsuario),
          });
        } else {
          set({ estaHidratado: true });
        }
      },
    }),
    {
      name: "autenticacion",
      partialize: (estado) => ({
        estaHidratado: estado.estaHidratado,
      }),
      onRehydrateStorage: () => (estado) => {
        if (estado) {
          estado.establecerHidratado();
        }
      },
    }
  )
);

export type { DatosUsuario, DatosSistema, DatosModulo, HijoModulo, AlmacenamientoAutenticacion };
