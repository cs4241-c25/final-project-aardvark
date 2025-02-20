"use client";

import { motion } from "motion/react";

export default function GameHeader({ category }: { category: string }) {
  return (
    <header className="text-center mt-2 mx-auto">
      <h1 className="font-funnel font-black text-4xl md:text-6xl">Consensus</h1>
      <motion.div
        className="flex justify-between opacity-0 ml-1 text-sm md:text-base"
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