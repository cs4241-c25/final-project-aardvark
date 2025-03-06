"use client"

import { createContext, useContext, useState } from "react";
import Toast from "@/components/ui/Toast";

type ToastContent = {
  title: string;
  message: string;
  type?: "default" | "error";
};

type ToastContextType = {
  showToast: (title: string, message: string, type?: "default" | "error") => void;
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toast, setToast] = useState<ToastContent | null>(null);

  const showToast = (title: string, message: string, type: "default" | "error" = "default") => {
    setToast({ title, message, type });
    const timeout = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(timeout)
  };

  const closeToast = () => setToast(null);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast && <Toast title={toast.title} message={toast.message} type={toast.type} closeToast={closeToast} />}
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within a ToastProvider");
  return context;
}