"use client";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import Button from "@/components/ui/Button";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <motion.div
        initial={{ y: "100%", opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: "100%", opacity: 0 }}
        transition={{ type: "spring", stiffness: 80, damping: 20, duration: 0.6 }}
        className="w-full max-w-2xl bg-background dark:bg-foreground p-2 rounded shadow-lg"
      >
        <div className="flex justify-end items-center">
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200">
            <X className="w-5 h-5 dark:text-background" />
          </button>
        </div>
        <div className="px-6 pb-2 dark:text-background">
          {children}
        </div>
      </motion.div>
    </div>
  );
};

export default Modal;