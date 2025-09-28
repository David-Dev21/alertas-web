import { create } from 'zustand';

interface AlertaSeleccionState {
  alertaDestacada: string | null;
  destacarAlerta: (alertaId: string) => void;
  limpiarDestacado: () => void;
}

export const useAlertaSeleccionStore = create<AlertaSeleccionState>((set) => ({
  alertaDestacada: null,
  destacarAlerta: (alertaId: string) => set({ alertaDestacada: alertaId }),
  limpiarDestacado: () => set({ alertaDestacada: null }),
}));
