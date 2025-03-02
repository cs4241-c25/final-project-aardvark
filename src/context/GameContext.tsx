"use client";

import {
  ConsensiRecord,
  GameDataRecord,
  Tile,
  TodaysConsensus,
  UserData,
} from "@/lib/interfaces";
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
  userData: UserData;
  setUserData: Dispatch<SetStateAction<UserData>>;
  loading: boolean;
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
  const [userData, setUserData] = useState<UserData>({
    played: null,
    score: null,
    stats: null,
  });
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
    // has the user played today?
    setLoading(true);
    axios
      .get(`/api/${session?.user?.email}/gameData/today`)
      .then(function (response) {
        const userSubmissionArr: GameDataRecord[] = response.data.result;
        if (userSubmissionArr.length > 0) {
          // user has played today
          const userSubmission: GameDataRecord = userSubmissionArr[0];
          // set user submission in context
          const todaysUserData: UserData = {
            played: userSubmission,
            score: null,
            stats: null,
          };
          setUserData(todaysUserData);
          // check auth
          if (session?.user?.image === "anonymous") {
            // user is unauthenticated
            setTimeout(
              () =>
                showToast(
                  "",
                  "Thanks for playing consensus today! 🎉",
                  "default"
                ),
              500
            );
          } else {
            // user is signed in with account
            setTimeout(
              () =>
                showToast(
                  `Welcome back ${session?.user?.name}`,
                  "Thanks for playing consensus today! 🎉",
                  "default"
                ),
              500
            );
          }
          setLoading(false);
        } else {
          // user has not played today
          // check auth
          if (session?.user?.image === "anonymous") {
            // user is unauthenticated
          } else {
            // user is logged in with account
            // get stats?
            setTimeout(
              () =>
                showToast(
                  "",
                  `Welcome back ${session?.user?.name} 👋`,
                  "default"
                ),
              500
            );
          }
        }
      })
      .catch(function (error) {
        setLoading(false);
        showToast("Error", error, "error");
      })
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
        setLoading(false);
        showToast("Error", error, "error");
      })
      .finally(function () {
        // always executed
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchTodaysConsensus();
    fetchUserSubmission();
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
        userData,
        setUserData,
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
