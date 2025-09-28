// Servicio para manejar la conexión con el WebSocket de alertas
import { io, Socket } from 'socket.io-client';

interface ParametrosConexion {
  idUsuario: string;
  tipo: 'SUPERVISOR';
  idDepartamento: number;
}

class AlertasSocketService {
  private socket: Socket | null = null;
  private readonly url = process.env.NEXT_PUBLIC_ALERTAS_WS_URL || 'http://localhost:3001';
  private conexionCallbacks: ((conectado: boolean) => void)[] = [];
  private conectando: boolean = false;
  private parametrosActuales: ParametrosConexion | null = null;

  conectar(parametros: ParametrosConexion) {
    // Si ya estamos conectados con los mismos parámetros, no hacer nada
    if (
      this.socket?.connected &&
      this.parametrosActuales &&
      this.parametrosActuales.idUsuario === parametros.idUsuario &&
      this.parametrosActuales.idDepartamento === parametros.idDepartamento
    ) {
      return;
    }

    // Si ya estamos en proceso de conexión, no hacer nada
    if (this.conectando) {
      return;
    }

    // Si hay una conexión existente, desconectar primero
    if (this.socket) {
      this.desconectar();
    }

    this.conectando = true;
    this.parametrosActuales = parametros;

    const opcionesConexion: any = {
      transports: ['websocket'],
      autoConnect: false,
      query: {
        idUsuario: parametros.idUsuario,
        tipo: parametros.tipo,
        idDepartamento: parametros.idDepartamento.toString(),
      },
    };

    this.socket = io(this.url, opcionesConexion);

    this.socket.on('connect', () => {
      this.conectando = false;
      this.notificarCambioConexion(true);
    });

    this.socket.on('disconnect', () => {
      this.conectando = false;
      this.notificarCambioConexion(false);
    });

    this.socket.on('connect_error', () => {
      this.conectando = false;
      this.notificarCambioConexion(false);
    });

    this.socket.connect();
  }

  desconectar() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.conectando = false;
      this.parametrosActuales = null;
      this.notificarCambioConexion(false);
    }
  }

  private notificarCambioConexion(conectado: boolean) {
    this.conexionCallbacks.forEach((callback) => {
      try {
        callback(conectado);
      } catch (error) {
        console.error('Error en callback de conexión:', error);
      }
    });
  }

  // Método para suscribirse a cambios de conexión
  onConexionCambiada(callback: (conectado: boolean) => void) {
    this.conexionCallbacks.push(callback);
  }

  // Método para desuscribirse de cambios de conexión
  offConexionCambiada(callback: (conectado: boolean) => void) {
    this.conexionCallbacks = this.conexionCallbacks.filter((cb) => cb !== callback);
  }

  // Suscripción a nuevas alertas (solo para supervisores)
  onNuevaAlerta(callback: (datos: { idAlerta: string; estado: string; origen: string; fechaHora: string; victima: string }) => void) {
    this.socket?.on('nuevaAlerta', callback);
  }

  // Desuscripción de nuevas alertas
  offNuevaAlerta(callback: (datos: { idAlerta: string; estado: string; origen: string; fechaHora: string; victima: string }) => void) {
    this.socket?.off('nuevaAlerta', callback);
  }

  // Suscripción a cancelaciones de solicitud (solo para supervisores)
  onCancelacionSolicitud(callback: (datos: { idSolicitud: string; idAlerta: string; estado: string; fechaHora: string; victima: string }) => void) {
    this.socket?.on('cancelacionSolicitud', callback);
  }

  // Desuscripción de cancelaciones de solicitud
  offCancelacionSolicitud(callback: (datos: { idSolicitud: string; idAlerta: string; estado: string; fechaHora: string; victima: string }) => void) {
    this.socket?.off('cancelacionSolicitud', callback);
  }

  // Métodos genéricos para escuchar eventos específicos
  escucharEvento(evento: string, callback: (...args: any[]) => void) {
    this.socket?.on(evento, callback);
  }

  dejarDeEscucharEvento(evento: string, callback: (...args: any[]) => void) {
    this.socket?.off(evento, callback);
  }
}

export const alertasSocketService = new AlertasSocketService();
