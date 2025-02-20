import { Tile } from "@/context/GameContext";
import clsx from "clsx";

const rankColorsBg: Record<1|2|3|4, string> = {
  1: "bg-rank1",
  2: "bg-rank2",
  3: "bg-rank3",
  4: "bg-rank4",
}

const rankColorsBorder: Record<1|2|3|4, string> = {
  1: "border-rank1",
  2: "border-rank2",
  3: "border-rank3",
  4: "border-rank4",
}

interface WordBankTileProps {
  tile: Tile;
  handleClick: (tile: Tile) => void;
};

function WordBankTile({ tile, handleClick }: WordBankTileProps) {
  return (
    <button
      className="h-12 rounded bg-neutral-200 text-[#0a0a0a] uppercase font-bold"
      onClick={() => handleClick(tile)}
    >
      {tile.displayName}
    </button>
  );
};

interface EmptyRankedTileProps {
  id: 1 | 2 | 3 | 4;
  handleClick: (rank: 1 | 2 | 3 | 4) => void;
  currentDestination: 1 | 2 | 3 | 4 | null;
};

function EmptyRankedTile({ id, handleClick, currentDestination }: EmptyRankedTileProps) {
  const color = `rank${id}`;
  return (
    <button
      className={clsx(
        "h-16 rounded border-2 hover:border-4 transition-all bg-inset",
        rankColorsBorder[id],
        currentDestination === id ? "border-4 bg-white/30" : "",
      )}
      onClick={() => id !== undefined && handleClick(id)}
    ></button>
  );
};

interface RankedTileProps {
  id: 1 | 2 | 3 | 4;
  tile: Tile;
  handleClick: (tile: Tile) => void;
}

function RankedTile({ id, tile, handleClick }: RankedTileProps) {
  const color = `rank${id}`;
  return (
    <button
      className={clsx(
        "h-16 rounded uppercase font-bold text-[#0a0a0a]",
        rankColorsBg[id]
      )}
      onClick={() => handleClick(tile)}
    >
      {tile.displayName}
    </button>
  );
}

export { WordBankTile, RankedTile, EmptyRankedTile };