'use client'

import React, { createContext, useContext, useState, Dispatch, SetStateAction } from "react";

interface GameContextType {
  tiles: Tile[];
  setTiles: Dispatch<SetStateAction<Tile[]>>;
}

export interface Tile {
  _id: number;
  displayName: string;
  rank: 1 | 2 | 3 | 4 | undefined;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tiles, setTiles] = useState<Tile[]>([
    { _id: 0, displayName: "spring", rank: undefined },
    { _id: 1, displayName: "summer", rank: undefined },
    { _id: 2, displayName: "fall", rank: undefined },
    { _id: 3, displayName: "winter", rank: undefined },
  ]);

  return <GameContext.Provider value={{ tiles, setTiles }}>{children}</GameContext.Provider>;
};

export const useGameContext = () => {
  const context = useContext(GameContext);
  if (!context) throw new Error("useGameContext must be used within a GameProvider");
  return context;
};