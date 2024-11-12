import { create } from "zustand";

export enum AvailableDialogs {
  Confirmation,
}

type VisualStoreDetails = {
  activeDialogs: Array<{
    type: AvailableDialogs;
  }>;
  setActiveDialog: (item: AvailableDialogs) => void;
  addActiveDialog: (item: AvailableDialogs) => void;
  closeDialog: () => void;
  closeAllDialogs: () => void;
};

export const useVisualStore = create<VisualStoreDetails>((set) => ({
  activeDialogs: [],
  get activeDialog() {
    return this.activeDialogs.length === 1 ? this.activeDialogs[0] : null;
  },
  setActiveDialog: (item: AvailableDialogs) => {
    set({
      activeDialogs: [item],
    });
  },
  addActiveDialog: (item: AvailableDialogs) => {
    set((state) => {
      return {
        activeDialogs: [...state.activeDialogs, item],
      };
    });
  },
  closeDialog: () => {
    set((state) => {
      const activeDialogs = [...state.activeDialogs];
      activeDialogs.pop();
      return {
        activeDialogs,
      };
    });
  },
  closeAllDialogs: () => {
    set({
      activeDialogs: [],
    });
  },
}));
