"use client";

import { ConsensiRecord, GameDataRecord } from "@/lib/interfaces";
import axios from "axios";
import { useSession } from "next-auth/react";
import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import { useToast } from "./ToastContext";

interface GameContextType {
  tiles: Tile[];
  setTiles: Dispatch<SetStateAction<Tile[]>>;
  submitted: boolean;
  setSubmitted: Dispatch<SetStateAction<boolean>>;
  consensusTheme: ConsensiRecord | undefined;
  setConsensusTheme: Dispatch<SetStateAction<ConsensiRecord | undefined>>;
  todaysConsensus: TodaysConsensus | undefined;
  setTodaysConsensus: Dispatch<SetStateAction<TodaysConsensus | undefined>>;
  loading: boolean;
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
  const { data: session } = useSession();
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
  const [loading, setLoading] = useState<boolean>(false);
  const { showToast } = useToast();

  const fetchUserSubmission = () => {
    setLoading(true);
    axios
      .get(`/api/${session?.user?.email}/gameData/today`)
      .then(function (response) {
        const userSubmissions = response.data.result;
        if (userSubmissions.length > 0) {
          setSubmitted(true);
          const userSubmission: GameDataRecord = userSubmissions[0];
          const tempTiles: Tile[] = [
            { _id: 0, displayName: "", rank: undefined },
            { _id: 1, displayName: "", rank: undefined },
            { _id: 2, displayName: "", rank: undefined },
            { _id: 3, displayName: "", rank: undefined },
          ];
          let i = 0;
          Object.entries(userSubmission.submission).forEach(([key, value]) => {
            tempTiles[i].displayName = key;
            tempTiles[i].rank = value;
            i++;
          });
          setTiles(tempTiles);
          setLoading(false);
          setTimeout(
            () =>
              showToast(
                "🎉",
                "Thanks for playing consensus today! 🎉",
                "default"
              ),
            500
          );
        }
      })
      .catch(function (error) {})
      .finally(function () {
        setLoading(false);
      });
  };

  const fetchTodaysConsensus = () => {
    // TODO need to make this work by date or however we want to fetch new ones each day
    setLoading(true);
    axios
      .get("/api/consensi/1")
      .then(function (response) {
        // handle success
        const tempConsensus = response.data.consensi[0];
        setConsensusTheme(tempConsensus);
        const options = tempConsensus.options;
        if (!submitted) {
          setTiles((prev) =>
            prev.map((tile) => {
              return {
                ...tile,
                displayName: options[tile._id],
              };
            })
          );
        }
        setLoading(false);
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      })
      .finally(function () {
        // always executed
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchUserSubmission();
    fetchTodaysConsensus();
  }, []);

  return (
    <GameContext.Provider
      value={{
        tiles,
        setTiles,
        submitted,
        setSubmitted,
        consensusTheme,
        setConsensusTheme,
        todaysConsensus,
        setTodaysConsensus,
        loading,
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
