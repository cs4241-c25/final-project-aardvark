import { createContext, ReactNode, useContext, useState } from "react";

type ModalType = "Statistics" | "How to Play" | null;

interface ModalContextProps {
  openModal: (type: ModalType) => void;
  closeModal: () => void;
  modalType: ModalType;
}

const ModalContext = createContext<ModalContextProps | undefined>(undefined);

export function ModalProvider({ children }: { children: ReactNode }) {
  const [modalType, setModalType] = useState<ModalType>(null);

  const openModal = (type: ModalType) => {
    setModalType(type);
  };

  const closeModal = () => {
    setModalType(null);
  };

  return (
    <ModalContext.Provider value={{ openModal, closeModal, modalType }}>
      {children}
    </ModalContext.Provider>
  );
}

export function useModal() {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
}
