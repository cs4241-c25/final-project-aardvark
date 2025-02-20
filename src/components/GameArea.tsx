"use client"

import { useState } from "react";

import { useGameContext, Tile } from "@/context/GameContext";
import { WordBankTile, RankedTile, EmptyRankedTile } from "@/components/GameTiles";

export default function GameArea() {
  const containers: (1|2|3|4)[] = [1, 2, 3, 4];
  const { tiles, setTiles } = useGameContext();

  const [destination, setDestination] = useState<1 | 2 | 3 | 4 | null>(null);

  const handleWordBankClick = (tile: Tile) => {
    setTiles((prevTiles) => {
      const assignedRanks = prevTiles
        .filter((t) => t.rank !== undefined)
        .map((t) => t.rank as 1 | 2 | 3 | 4); // Ensure type matches
  
      // Find the lowest available rank from [1, 2, 3, 4]
      const availableRank = ([1, 2, 3, 4] as const).find((r) => !assignedRanks.includes(r));
  
      const newRank: 1 | 2 | 3 | 4 | undefined = destination ?? availableRank; // Ensure correct type
  
      return prevTiles.map((t) =>
        t._id === tile._id && newRank !== undefined ? { ...t, rank: newRank } : t
      );
    });
  
    setDestination(null);
  };

  const handleEmptyRankClick = (rank: 1 | 2 | 3 | 4) => {
    if (destination === rank) {
      setDestination(null);
    } else {
      setDestination(rank);
    }
  };

  const handleRankedTileClick = (tile: Tile) => {
    if (destination) {
      setTiles((prevTiles) => {
        return prevTiles.map((t) => t._id === tile._id ? { ...t, rank: destination } : t);
      });
    } else {
      setTiles((prevTiles) => {
        return prevTiles.map((t) => t._id === tile._id ? { ...t, rank: undefined } : t);
      });
    }
    setDestination(null);
  };

  return (
    <div className="w-full max-w-lg">
      <div className="flex flex-col gap-2 mb-10">
        {containers.map((containerId) => {
          const tile = tiles.find(tile => tile.rank === containerId);
          return tile ? (
            <RankedTile tile={tile} id={containerId} key={tile.displayName} handleClick={handleRankedTileClick} />
          ) : (
            <EmptyRankedTile id={containerId} key={containerId} handleClick={handleEmptyRankClick} currentDestination={destination} />
          )
        })}
      </div>
      <div className="grid grid-cols-2 grid-rows-2 gap-2">
        {tiles.map((tile) => {
          return tile.rank ? (
            <div className="h-12 rounded bg-inset" key={tile._id}></div>
          ) : (
            <WordBankTile tile={tile} key={tile._id} handleClick={handleWordBankClick} />
          )
        })}
      </div>
    </div>
  );
}