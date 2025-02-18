'use client'

import { createContext, useContext, useState } from "react";

interface GameContextType {
  items: string[];
  setItems: (items: string[]) => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<string[]>(["Rect 1", "Rect 2", "Rect 3", "Rect 4"]);

  return <GameContext.Provider value={{ items, setItems }}>{children}</GameContext.Provider>;
};

export const useGameContext = () => {
  const context = useContext(GameContext);
  if (!context) throw new Error("useGameContext must be used within a GameProvider");
  return context;
};