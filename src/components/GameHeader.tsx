"use client";

import { motion } from "framer-motion";

export default function GameHeader({ category }: { category: string }) {
  return (
    <header className="text-center mt-2 mx-auto">
      <h1 className="font-funnel font-black text-6xl">Consensus</h1>
      <motion.div
        className="flex justify-between opacity-0 ml-1"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <p>Category: {category}</p>
        <p>#001</p>
      </motion.div>
    </header>
  );
}