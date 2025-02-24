import { Tile, useGameContext } from "@/context/GameContext";
import clsx from "clsx";
import { motion } from "motion/react";

const rankColorsBg: Record<1 | 2 | 3 | 4, string> = {
  1: "bg-rank1",
  2: "bg-rank2",
  3: "bg-rank3",
  4: "bg-rank4",
};

const rankColorsBorder: Record<1 | 2 | 3 | 4, string> = {
  1: "border-rank1",
  2: "border-rank2",
  3: "border-rank3",
  4: "border-rank4",
};

interface WordBankTileProps {
  tile: Tile;
  handleClick: (tile: Tile) => void;
}

function WordBankTile({ tile, handleClick }: WordBankTileProps) {
  return (
    <motion.button
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 15 }}
      className="h-10 md:h-12 rounded bg-neutral-200 text-[#0a0a0a] uppercase font-bold"
      onClick={() => handleClick(tile)}
    >
      {tile.displayName}
    </motion.button>
  );
}

interface RankedTileProps {
  id: 1 | 2 | 3 | 4;
  tile: Tile;
  handleClick: (tile: Tile) => void;
  animateOnSubmit: boolean;
}

function RankedTile({
  id,
  tile,
  handleClick,
  animateOnSubmit,
}: RankedTileProps) {
  const { submitted } = useGameContext();
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
        "h-12 md:h-16 rounded uppercase font-bold text-[#0a0a0a]",
        rankColorsBg[id]
      )}
      onClick={() => handleClick(tile)}
      disabled={submitted}
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
        rankColorsBorder[id],
        currentDestination === id ? "border-4 dark:bg-white/30 bg-black/20" : ""
      )}
      onClick={() => id !== undefined && handleClick(id)}
    >
      {id}
    </button>
  );
}

export { EmptyRankedTile, RankedTile, WordBankTile };
