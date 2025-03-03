"use client";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import clsx from "clsx";

interface ModalProps {
  title?: string;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
}

const Modal: React.FC<ModalProps> = ({ title, onClose, children, className }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-40">
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%", opacity: 0 }}
        transition={{
          type: "spring",
          stiffness: 80,
          damping: 20,
          duration: 0.6,
        }}
        className={clsx(
          "bg-background dark:bg-neutral-900 p-6 rounded shadow-lg z-50",
          className,
        )}
      >
        <div className={`flex relative justify-center`}>
          {title && <h1 className="text-xl font-funnel font-bold">{title}</h1>}
          <button
            onClick={onClose}
            className="rounded-full hover:bg-gray-200 dark:hover:bg-neutral-700 absolute right-0"
          >
            <X className="h-8 w-8 p-2" />
          </button>
        </div>
        <div>{children}</div>
      </motion.div>
    </div>
  );
};

export default Modal;