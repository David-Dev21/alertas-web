import { create } from "zustand";

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
    latitud?: number;
    longitud?: number;
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
  accessToken: string | null;
  datosUsuario: DatosUsuario | null;
  datosSistema: DatosSistema | null;
  estaAutenticado: boolean;
  setToken: (token: string | null) => void;
  setDatosUsuario: (datosUsuario: DatosUsuario | null) => void;
  setUbicacionUsuario: (idDepartamento: number, departamento: string, latitud?: number, longitud?: number) => void;
  setRoles: (roles: DatosRol[]) => void;
  setModulos: (modulos: DatosModulo[]) => void;
  setPermisos: (permisos: any[]) => void;
  setDatosSistema: (datosSistema: DatosSistema | null) => void;
  cerrarSesion: () => void;
  inicializar: () => void;
}

// Funciones helper para localStorage
const guardarEnLocalStorage = (clave: string, valor: any) => {
  if (typeof window === "undefined") return;
  if (valor === null) {
    localStorage.removeItem(clave);
  } else if (typeof valor === "string") {
    localStorage.setItem(clave, valor);
  } else {
    localStorage.setItem(clave, JSON.stringify(valor));
  }
};

const leerDeLocalStorage = (clave: string) => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(clave);
};

const leerObjetoDeLocalStorage = (clave: string) => {
  const valor = leerDeLocalStorage(clave);
  if (!valor) return null;
  try {
    return JSON.parse(valor);
  } catch {
    return null;
  }
};

export const useAutenticacionStore = create<AlmacenamientoAutenticacion>()((set, get) => ({
  accessToken: null,
  datosUsuario: null,
  datosSistema: null,
  estaAutenticado: false,

  setToken: (token: string | null) => {
    guardarEnLocalStorage("access_token", token);

    if (!token) {
      guardarEnLocalStorage("refresh_token", null);
    }

    set((estado) => ({
      accessToken: token,
      estaAutenticado: !!token && !!estado.datosUsuario,
    }));
  },

  setDatosUsuario: (datosUsuario: DatosUsuario | null) => {
    guardarEnLocalStorage("datosUsuario", datosUsuario);

    set((estado) => ({
      datosUsuario,
      estaAutenticado: !!estado.accessToken && !!datosUsuario,
    }));
  },

  setUbicacionUsuario: (idDepartamento: number, departamento: string, latitud?: number, longitud?: number) => {
    set((estado) => {
      if (!estado.datosUsuario) return estado;

      const datosUsuarioActualizados = {
        ...estado.datosUsuario,
        ubicacion: { idDepartamento, departamento, latitud, longitud },
      };

      guardarEnLocalStorage("datosUsuario", datosUsuarioActualizados);

      return { datosUsuario: datosUsuarioActualizados };
    });
  },

  setRoles: (roles: DatosRol[]) =>
    set((estado) => ({
      datosSistema: estado.datosSistema ? { ...estado.datosSistema, roles } : { nombre: "", roles, modulos: [], permisos: [] },
    })),

  setModulos: (modulos: DatosModulo[]) =>
    set((estado) => ({
      datosSistema: estado.datosSistema ? { ...estado.datosSistema, modulos } : { nombre: "", roles: [], modulos, permisos: [] },
    })),

  setPermisos: (permisos: any[]) =>
    set((estado) => ({
      datosSistema: estado.datosSistema ? { ...estado.datosSistema, permisos } : { nombre: "", roles: [], modulos: [], permisos },
    })),

  setDatosSistema: (datosSistema: DatosSistema | null) => {
    guardarEnLocalStorage("datosSistema", datosSistema);
    set({ datosSistema });
  },

  cerrarSesion: () => {
    guardarEnLocalStorage("access_token", null);
    guardarEnLocalStorage("refresh_token", null);
    guardarEnLocalStorage("datosUsuario", null);
    guardarEnLocalStorage("datosSistema", null);

    set({
      accessToken: null,
      datosUsuario: null,
      datosSistema: null,
      estaAutenticado: false,
    });
  },

  // Esta función se llama UNA VEZ al iniciar la app
  inicializar: () => {
    const token = leerDeLocalStorage("access_token");
    const datosUsuario = leerObjetoDeLocalStorage("datosUsuario");
    const datosSistema = leerObjetoDeLocalStorage("datosSistema");

    set({
      accessToken: token,
      datosUsuario,
      datosSistema,
      estaAutenticado: !!(token && datosUsuario),
    });
  },
}));

export type { DatosUsuario, DatosSistema, DatosModulo, HijoModulo, AlmacenamientoAutenticacion };
