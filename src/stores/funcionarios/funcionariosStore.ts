import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import io, { Socket } from 'socket.io-client';
import { UbicacionTiempoReal, FuncionarioUbicacion, convertirUbicacionAFuncionario } from '@/types/atenciones/Funcionario';

const SOCKET_SERVER_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';

// Mantenemos la interfaz existente para compatibilidad con componentes existentes
export interface UbicacionFuncionario {
  idFuncionario: string;
  nombres: string;
  apellidos: string;
  cargo: string;
  ubicacion: {
    latitud: number;
    longitud: number;
  };
  timestamp: string;
  disponible: boolean;
  distanciaEnMetros?: number;
  alertaId?: string; // Nueva propiedad para asociar con una alerta específica
}

interface FuncionariosStore {
  // Estado del WebSocket específico para funcionarios
  socket: Socket | null;
  isConnected: boolean;

  // Estado de funcionarios
  funcionarios: UbicacionFuncionario[];
  funcionariosAsignados: { [alertaId: string]: string[] }; // alertaId -> funcionarioIds asignados manualmente
  isLoading: boolean;

  // Acciones del WebSocket
  inicializarSocket: () => void;
  cerrarSocket: () => void;
  establecerConexion: (connected: boolean) => void;

  // Acciones de funcionarios
  actualizarUbicacionFuncionario: (funcionario: UbicacionFuncionario) => void;
  removerFuncionario: (idFuncionario: string) => void;
  establecerFuncionarios: (funcionarios: UbicacionFuncionario[]) => void;
  establecerCargando: (loading: boolean) => void;

  // Acciones de asignación manual
  asignarFuncionario: (alertaId: string, funcionarioId: string) => void;
  desasignarFuncionario: (alertaId: string, funcionarioId: string) => void;

  // Solicitar datos
  solicitarFuncionariosConectados: () => void;

  // Utilidades
  obtenerFuncionariosPorAlerta: (alertaId: string) => UbicacionFuncionario[];
  obtenerFuncionariosAsignados: (alertaId: string) => UbicacionFuncionario[];
}

export const useFuncionariosStore = create<FuncionariosStore>()(
  persist(
    (set, get) => ({
      // Estado inicial
      socket: null,
      isConnected: false,
      funcionarios: [],
      funcionariosAsignados: {}, // Inicializar objeto vacío para asignaciones
      isLoading: true,

      // Inicializar conexión WebSocket específica para funcionarios
      inicializarSocket: () => {
        const currentSocket = get().socket;
        if (currentSocket?.connected) return;

        console.log('🔗 Inicializando conexión WebSocket para funcionarios...');
        // Conectar al namespace principal ya que tu backend no usa namespaces específicos
        const newSocket = io(SOCKET_SERVER_URL, {
          transports: ['websocket', 'polling'],
          reconnection: true,
          reconnectionAttempts: 5,
          reconnectionDelay: 1000,
        });

        set({ socket: newSocket });

        newSocket.on('connect', () => {
          console.log('✅ Conectado al servidor WebSocket de funcionarios');
          set({ isConnected: true, isLoading: false });

          // Ya no necesitamos solicitar funcionarios conectados porque
          // tu backend no maneja ese evento aún
        });

        newSocket.on('disconnect', () => {
          console.log('❌ Desconectado del servidor WebSocket de funcionarios');
          set({ isConnected: false });
        });

        // Escuchar ubicaciones de funcionarios en tiempo real
        newSocket.on('ubicacionActualizada', (datos: UbicacionTiempoReal) => {
          console.log('📍 Ubicación de funcionario recibida:', datos);

          // Convertir la ubicación en tiempo real a FuncionarioUbicacion
          const funcionarioUbicacion = convertirUbicacionAFuncionario(datos);

          // Convertir a la interfaz legacy para compatibilidad
          const funcionario: UbicacionFuncionario = {
            idFuncionario: funcionarioUbicacion.idFuncionario,
            nombres: funcionarioUbicacion.nombreCompleto.split(' ')[0] || 'Sin nombre',
            apellidos: funcionarioUbicacion.nombreCompleto.split(' ').slice(1).join(' ') || 'Sin apellido',
            cargo: funcionarioUbicacion.unidad.abreviacion,
            ubicacion: {
              latitud: funcionarioUbicacion.ubicacion.latitud,
              longitud: funcionarioUbicacion.ubicacion.longitud,
            },
            timestamp: funcionarioUbicacion.timestamp,
            disponible: funcionarioUbicacion.disponible,
            // alertaId se removió - ahora las asignaciones son solo manuales
          };

          // Actualizar el estado del store
          set((state) => {
            const funcionarios = [...state.funcionarios];
            const index = funcionarios.findIndex((f) => f.idFuncionario === funcionario.idFuncionario);

            if (index !== -1) {
              // Actualizar funcionario existente
              funcionarios[index] = {
                ...funcionarios[index],
                ...funcionario,
              };
            } else {
              // Agregar nuevo funcionario
              funcionarios.push(funcionario);
            }

            console.log(`✅ Funcionario ${funcionario.nombres} ${funcionario.apellidos} actualizado en ${funcionario.cargo}`);
            return { funcionarios };
          });
        });

        newSocket.on('funcionarioUbicacionActualizada', (funcionario: UbicacionFuncionario) => {
          console.log('📍 Ubicación de funcionario actualizada:', funcionario);
          // Actualizar directamente sin llamar get()
          set((state) => {
            const funcionarios = [...state.funcionarios];
            const index = funcionarios.findIndex((f) => f.idFuncionario === funcionario.idFuncionario);

            if (index !== -1) {
              funcionarios[index] = funcionario;
            } else {
              funcionarios.push(funcionario);
            }

            return { funcionarios };
          });
        });

        newSocket.on('funcionarioDesconectado', (idFuncionario: string) => {
          console.log('📴 Funcionario desconectado:', idFuncionario);
          // Remover directamente sin llamar get()
          set((state) => ({
            funcionarios: state.funcionarios.filter((f) => f.idFuncionario !== idFuncionario),
          }));
        });

        newSocket.on('funcionariosConectados', (funcionarios: UbicacionFuncionario[]) => {
          console.log('👥 Lista de funcionarios conectados recibida:', funcionarios);
          // Establecer directamente sin llamar get()
          set({ funcionarios, isLoading: false });
        });

        newSocket.on('error', (error: any) => {
          console.error('❌ Error en WebSocket de funcionarios:', error);
        });

        return newSocket;
      },

      // Cerrar conexión WebSocket
      cerrarSocket: () => {
        const socket = get().socket;
        if (socket) {
          socket.disconnect();
          set({ socket: null, isConnected: false });
        }
      },

      // Establecer estado de conexión
      establecerConexion: (isConnected: boolean) => set({ isConnected }),

      // Actualizar ubicación de funcionario específico
      actualizarUbicacionFuncionario: (funcionarioActualizado: UbicacionFuncionario) => {
        set((state) => {
          const funcionarios = [...state.funcionarios];
          const index = funcionarios.findIndex((f) => f.idFuncionario === funcionarioActualizado.idFuncionario);

          if (index !== -1) {
            funcionarios[index] = funcionarioActualizado;
          } else {
            funcionarios.push(funcionarioActualizado);
          }

          return { funcionarios };
        });
      },

      // Remover funcionario de la lista
      removerFuncionario: (idFuncionario: string) => {
        set((state) => ({
          funcionarios: state.funcionarios.filter((f) => f.idFuncionario !== idFuncionario),
        }));
      },

      // Establecer lista completa de funcionarios
      establecerFuncionarios: (funcionarios: UbicacionFuncionario[]) => {
        set({ funcionarios });
      },

      // Establecer estado de carga
      establecerCargando: (isLoading: boolean) => set({ isLoading }),

      // Solicitar funcionarios conectados
      solicitarFuncionariosConectados: () => {
        const socket = get().socket;
        if (socket?.connected) {
          console.log('📡 Solicitando funcionarios conectados...');
          socket.emit('solicitarFuncionariosConectados');
        }
      },

      // Obtener funcionarios que están reportando ubicación (NO necesariamente asignados)
      obtenerFuncionariosPorAlerta: (alertaId: string) => {
        const funcionarios = get().funcionarios;
        // Solo retornar funcionarios disponibles, sin importar si tienen alertaId
        return funcionarios.filter((f) => f.disponible);
      },

      // Asignar funcionario manualmente a una alerta
      asignarFuncionario: (alertaId: string, funcionarioId: string) => {
        set((state) => {
          const asignados = state.funcionariosAsignados[alertaId] || [];
          if (!asignados.includes(funcionarioId)) {
            return {
              funcionariosAsignados: {
                ...state.funcionariosAsignados,
                [alertaId]: [...asignados, funcionarioId],
              },
            };
          }
          return state;
        });
      },

      // Desasignar funcionario de una alerta
      desasignarFuncionario: (alertaId: string, funcionarioId: string) => {
        set((state) => {
          const asignados = state.funcionariosAsignados[alertaId] || [];
          return {
            funcionariosAsignados: {
              ...state.funcionariosAsignados,
              [alertaId]: asignados.filter((id) => id !== funcionarioId),
            },
          };
        });
      },

      // Obtener funcionarios REALMENTE asignados a una alerta
      obtenerFuncionariosAsignados: (alertaId: string) => {
        const { funcionarios, funcionariosAsignados } = get();
        const idsAsignados = funcionariosAsignados[alertaId] || [];
        return funcionarios.filter((f) => idsAsignados.includes(f.idFuncionario));
      },
    }),
    {
      name: 'funcionarios-store',
      partialize: (state) => ({
        // Persistir datos esenciales, no el socket
        funcionarios: state.funcionarios,
        funcionariosAsignados: state.funcionariosAsignados, // Persistir asignaciones manuales
      }),
    },
  ),
);

/**
 * Calcular distancia entre dos puntos geográficos usando fórmula de Haversine
 * @param lat1 Latitud punto 1
 * @param lon1 Longitud punto 1
 * @param lat2 Latitud punto 2
 * @param lon2 Longitud punto 2
 * @returns Distancia en kilómetros
 */
export function calcularDistancia(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Radio de la Tierra en km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  return d;
}
