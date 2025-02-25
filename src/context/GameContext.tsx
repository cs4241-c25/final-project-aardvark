"use client";

import { ConsensiRecord } from "@/lib/interfaces";
import axios from "axios";
import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";

interface GameContextType {
  tiles: Tile[];
  setTiles: Dispatch<SetStateAction<Tile[]>>;
  submitted: boolean;
  setSubmitted: Dispatch<SetStateAction<boolean>>;
  consensusTheme: ConsensiRecord | undefined;
  todaysConsensus: TodaysConsensus | undefined;
  setTodaysConsensus: Dispatch<SetStateAction<TodaysConsensus | undefined>>;
}

export interface Tile {
  _id: number;
  displayName: string;
  rank: 1 | 2 | 3 | 4 | undefined;
}

interface TodaysConsensus {
  numSubmissions: number;
  consensus: Record<string, number>;
  userScore: number;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [consensusTheme, setConsensusTheme] = useState<
    ConsensiRecord | undefined
  >();
  const [todaysConsensus, setTodaysConsensus] = useState<
    TodaysConsensus | undefined
  >();
  const [tiles, setTiles] = useState<Tile[]>([
    { _id: 0, displayName: "", rank: undefined },
    { _id: 1, displayName: "", rank: undefined },
    { _id: 2, displayName: "", rank: undefined },
    { _id: 3, displayName: "", rank: undefined },
  ]);
  const [submitted, setSubmitted] = useState<boolean>(false);

  useEffect(() => {
    fetchTodaysConsensus();
  }, []);

  const fetchTodaysConsensus = () => {
    // TODO need to make this work by date or however we want to fetch new ones each day
    axios
      .get("/api/consensi/1")
      .then(function (response) {
        // handle success
        const tempConsensus = response.data.consensi[0];
        setConsensusTheme(tempConsensus);
        const options = tempConsensus.options;
        setTiles((prev) =>
          prev.map((tile) => {
            return {
              ...tile,
              displayName: options[tile._id],
            };
          })
        );
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      })
      .finally(function () {
        // always executed
      });
  };

  return (
    <GameContext.Provider
      value={{
        tiles,
        setTiles,
        submitted,
        setSubmitted,
        consensusTheme,
        todaysConsensus,
        setTodaysConsensus,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGameContext = () => {
  const context = useContext(GameContext);
  if (!context)
    throw new Error("useGameContext must be used within a GameProvider");
  return context;
};
