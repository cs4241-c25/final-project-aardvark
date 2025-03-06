import { useGameContext } from "@/context/GameContext";
import { Tile } from "@/lib/interfaces";
import clsx from "clsx";
import { motion } from "motion/react";

interface WordBankTileProps {
  tile: Tile;
  handleClick: (tile: Tile) => void;
}

function WordBankTile({ tile, handleClick }: WordBankTileProps) {
  const { bgColorMap } = useGameContext();
  return (
    <motion.button
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 15 }}
      className={clsx(
        "h-10 md:h-12 rounded text-[#0a0a0a] uppercase font-bold font-funnel md:text-xl",
        bgColorMap.get(tile.color),
      )}
      onClick={() => handleClick(tile)}
    >
      {tile.displayName}
    </motion.button>
  );
}

interface RankedTileProps {
  tile: Tile;
  handleClick: (tile: Tile) => void;
  animateOnSubmit: boolean;
}

function RankedTile({
  tile,
  handleClick,
  animateOnSubmit,
}: RankedTileProps) {
  const { submitted } = useGameContext();
  const { bgColorMap } = useGameContext();
  return (
    <motion.button
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{
        scale: 1,
        opacity: 1,
        ...(animateOnSubmit && { scale: [1, 1.1] }), // Pulse effect on submit
      }}
      transition={{ type: "spring", stiffness: 300, damping: 15 }}
      className={clsx(
        "h-12 md:h-16 rounded uppercase font-bold font-funnel text-[#0a0a0a] md:text-xl",
        bgColorMap.get(tile.color),
      )}
      onClick={() => handleClick(tile)}
      disabled={submitted === null || submitted}
    >
      {tile.displayName}
    </motion.button>
  );
}

interface EmptyRankedTileProps {
  id: 1 | 2 | 3 | 4;
  handleClick: (rank: 1 | 2 | 3 | 4) => void;
  currentDestination: 1 | 2 | 3 | 4 | null;
}

function EmptyRankedTile({
  id,
  handleClick,
  currentDestination,
}: EmptyRankedTileProps) {
  return (
    <button
      className={clsx(
        "h-12 md:h-16 rounded border-2 hover:border-4 transition-all bg-inset uppercase font-bold text-black/40 dark:text-white/40",
        currentDestination === id ? "border-4 dark:bg-white/30 bg-black/20" : ""
      )}
      onClick={() => id !== undefined && handleClick(id)}
    >
      {id}
    </button>
  );
}

export { EmptyRankedTile, RankedTile, WordBankTile };