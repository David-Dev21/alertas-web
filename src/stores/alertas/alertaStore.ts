import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { NuevaAlertaSimple } from '@/types/alertas/Alerta';

interface AlertaStore {
  // Estado de alertas pendientes
  alertasPendientes: NuevaAlertaSimple[];

  // Acciones
  agregarAlertaPendiente: (alerta: NuevaAlertaSimple) => void;
  removerAlertaPendiente: (idAlerta: string) => void;
}

export const useAlertaStore = create<AlertaStore>()(
  persist(
    (set) => ({
      // Estado inicial
      alertasPendientes: [],

      // Agregar alerta pendiente si no existe
      agregarAlertaPendiente: (alerta: NuevaAlertaSimple) =>
        set((state) => {
          // Validar que el ID no sea undefined
          if (!alerta) return state;

          const exists = state.alertasPendientes.some((a) => a.idAlerta === alerta.idAlerta);
          if (exists) return state;

          return {
            alertasPendientes: [...state.alertasPendientes, alerta],
          };
        }),

      // Remover alerta de pendientes
      removerAlertaPendiente: (idAlerta: string) =>
        set((state) => ({
          alertasPendientes: state.alertasPendientes.filter((a) => a.idAlerta !== idAlerta),
        })),
    }),
    {
      name: 'alertas-store',
      partialize: (state) => ({
        alertasPendientes: state.alertasPendientes,
      }),
      version: 1,
    },
  ),
);
