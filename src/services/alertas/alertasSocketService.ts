// Servicio para manejar la conexión con el WebSocket de alertas
import { io, Socket } from "socket.io-client";

interface ParametrosConexion {
  idUsuario: string;
  tipo: "SUPERVISOR";
  idDepartamento: number;
  token: string;
}

let socket: Socket | null = null;
const url = process.env.NEXT_PUBLIC_ALERTAS_WS_URL;
let conexionCallbacks: ((conectado: boolean) => void)[] = [];
let conectando: boolean = false;
let parametrosActuales: ParametrosConexion | null = null;

export const alertasSocketService = {
  conectar: (parametros: ParametrosConexion) => {
    // Si ya estamos conectados con los mismos parámetros, no hacer nada
    if (
      socket?.connected &&
      parametrosActuales &&
      parametrosActuales.idUsuario === parametros.idUsuario &&
      parametrosActuales.idDepartamento === parametros.idDepartamento
    ) {
      return;
    }

    // Si ya estamos en proceso de conexión, no hacer nada
    if (conectando) {
      return;
    }

    // Si hay una conexión existente, desconectar primero
    if (socket) {
      alertasSocketService.desconectar();
    }

    conectando = true;
    parametrosActuales = parametros;

    const opcionesConexion: any = {
      transports: ["websocket"],
      autoConnect: false,
      auth: {
        token: parametros.token,
      },
      query: {
        idUsuario: parametros.idUsuario,
        tipo: parametros.tipo,
        idDepartamento: parametros.idDepartamento.toString(),
      },
    };

    socket = io(url, opcionesConexion);

    socket.on("connect", () => {
      conectando = false;
      alertasSocketService.notificarCambioConexion(true);
    });

    socket.on("disconnect", () => {
      conectando = false;
      alertasSocketService.notificarCambioConexion(false);
    });

    socket.on("connect_error", () => {
      conectando = false;
      alertasSocketService.notificarCambioConexion(false);
    });

    socket.connect();
  },

  desconectar: () => {
    if (socket) {
      socket.disconnect();
      socket = null;
      conectando = false;
      parametrosActuales = null;
      alertasSocketService.notificarCambioConexion(false);
    }
  },

  notificarCambioConexion: (conectado: boolean) => {
    conexionCallbacks.forEach((callback) => {
      try {
        callback(conectado);
      } catch (error) {
        console.error("Error en callback de conexión:", error);
      }
    });
  },

  // Método para suscribirse a cambios de conexión
  onConexionCambiada: (callback: (conectado: boolean) => void) => {
    conexionCallbacks.push(callback);
  },

  // Método para desuscribirse de cambios de conexión
  offConexionCambiada: (callback: (conectado: boolean) => void) => {
    conexionCallbacks = conexionCallbacks.filter((cb) => cb !== callback);
  },

  // Suscripción a nuevas alertas (solo para supervisores)
  onNuevaAlerta: (callback: (datos: { idAlerta: string; estado: string; origen: string; fechaHora: string; victima: string }) => void) => {
    socket?.on("nuevaAlerta", callback);
  },

  // Desuscripción de nuevas alertas
  offNuevaAlerta: (callback: (datos: { idAlerta: string; estado: string; origen: string; fechaHora: string; victima: string }) => void) => {
    socket?.off("nuevaAlerta", callback);
  },

  // Suscripción a cancelaciones de solicitud (solo para supervisores)
  onCancelacionSolicitud: (
    callback: (datos: { idSolicitud: string; idAlerta: string; estado: string; fechaHora: string; victima: string }) => void
  ) => {
    socket?.on("cancelacionSolicitud", callback);
  },

  // Desuscripción de cancelaciones de solicitud
  offCancelacionSolicitud: (
    callback: (datos: { idSolicitud: string; idAlerta: string; estado: string; fechaHora: string; victima: string }) => void
  ) => {
    socket?.off("cancelacionSolicitud", callback);
  },

  // Métodos genéricos para escuchar eventos específicos
  escucharEvento: (evento: string, callback: (...args: any[]) => void) => {
    socket?.on(evento, callback);
  },

  dejarDeEscucharEvento: (evento: string, callback: (...args: any[]) => void) => {
    socket?.off(evento, callback);
  },
};
