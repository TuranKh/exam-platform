import { create } from "zustand";

export const useModalStore = create((set) => ({
  isModalOpen: false,
  message: "Əminsiniz?",
  openModal: ({ message, onConfirm, onReject }: OpenModalProps) =>
    set(() => ({ isModalOpen: true, message, onConfirm, onReject })),
  closeModal: () => set(() => ({ isModalOpen: false })),
}));

type OpenModalProps = {
  message: string;
  onConfirm: () => Promise<void> | void;
  onReject: () => Promise<void> | void;
};
