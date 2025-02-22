"use client";

import { motion } from "motion/react";
import { IconButton } from "./ui/Button";
import { User, ChartColumnBig, CircleHelp, History } from "lucide-react";
import { useGameContext } from "@/context/GameContext";

export default function GameHeader({ category }: { category: string }) {
  return (
    <header className="flex md:px-4 border-b border-inset py-2">
      <div className="flex items-center">
        <h1 className="font-funnel font-black text-6xl md:text-4xl border-r pr-4">Consensus</h1>
        <motion.p
          className="md:text-base text-sm ml-4"
          initial={{ opacity: 0, x: -25 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          #001 - {category}
        </motion.p>
      </div>
      <div className="flex flex-grow justify-end items-center gap-1">
        <IconButton icon={<History />} /> {/* goes to consensus archive- TODO: create page */}
        <IconButton icon={<ChartColumnBig />} /> {/* goes to statistics for today's consensus- TODO: create page */}
        <IconButton icon={<CircleHelp />} /> {/* opens how to play modal- TODO: create modal */}
        <IconButton icon={<User />} />
      </div>
    </header>
  );
}