"use client";

import { XCircle } from "@phosphor-icons/react";
import clsx from "clsx";
import { motion } from "framer-motion";
import { X } from "lucide-react";

export default function Toast({
  title,
  message,
  type = "default",
  closeToast,
}: {
  title: string;
  message: string;
  type?: "default" | "error";
  closeToast: () => void;
}) {
  const bgColor = {
    default: "bg-neutral-800",
    error: "bg-red-500",
  }[type];

  return (
    <motion.div
      className={clsx(
        "fixed bottom-5 right-5 px-3 py-2 text-white rounded shadow-lg z-50 flex items-center",
        bgColor
      )}
      initial={{ opacity: 0, y: 20 }}
      exit={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div>
        <div className="flex items-center gap-1">
          {type === "error" && <XCircle size={18} />}
          <h1 className="font-bold">{title}</h1>
        </div>
        <p>{message}</p>
      </div>
      <button className="hover:bg-neutral-700 rounded-full ml-2" onClick={closeToast}>
        <X className="h-8 w-8 p-2" />
      </button>
    </motion.div>
  );
}
