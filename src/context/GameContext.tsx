"use client";

import {
  ConsensiRecord,
  GameDataRecord,
  Tile,
  TodaysConsensus,
  UserData,
} from "@/lib/interfaces";
import { getUserScore } from "@/utils/scoreUtils";
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
  submitted: boolean | null;
  setSubmitted: Dispatch<SetStateAction<boolean | null>>;
  consensusTheme: ConsensiRecord | undefined;
  setConsensusTheme: Dispatch<SetStateAction<ConsensiRecord | undefined>>;
  todaysConsensus: TodaysConsensus | undefined;
  setTodaysConsensus: Dispatch<SetStateAction<TodaysConsensus | undefined>>;
  userData: UserData;
  setUserData: Dispatch<SetStateAction<UserData>>;
  loading: boolean;
  bgColorMap: Map<string, string>;
  animateTilesOnSubmit: boolean;
  doSubmissionAnimation: () => void;
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
  const [tiles, setTiles] = useState<Tile[]>(
    Array.from({ length: 4 }, (_, i) => ({
      _id: i,
      displayName: "",
      rank: undefined,
      color: "",
    }))
  );
  const bgColorMap: Map<string, string> = new Map([
    ["blue", "bg-gameBlue"],
    ["green", "bg-gameGreen"],
    ["yellow", "bg-gameYellow"],
    ["red", "bg-gameRed"],
  ]);
  const [submitted, setSubmitted] = useState<boolean | null>(null);
  const [animateTilesOnSubmit, setAnimateTilesOnSubmit] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const { showToast } = useToast();

  const doSubmissionAnimation = () => {
    setAnimateTilesOnSubmit(true);
    setTimeout(() => setAnimateTilesOnSubmit(false), 800);
  }

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

          setSubmitted(true);
          setTiles((prevTiles) =>
            prevTiles.map((tile) => ({
              ...tile,
              rank: userSubmission.submission[tile.displayName],
            }))
          );

          axios
            .get("/api/date")
            .then(function (response) {
              const today = response.data.date;
              // get consensus and user submission
              axios
                .get(`/api/gameData/consensus/${today}`)
                .then(function (response) {
                  // successfully calculated consensus
                  // set consensus in state
                  const consensusObj = response.data.consensusData;
                  setTodaysConsensus(consensusObj);

                  const userScore = getUserScore(userSubmission, consensusObj);
                  const todaysUserData: UserData = {
                    played: userSubmission,
                    score: userScore,
                    stats: null,
                  };
                  setUserData(todaysUserData);
                });
            })
            .catch(function (error) {
              console.error(error);
            });

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
          setSubmitted(false);
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
        // showToast("Error", error, "error");
      })
      .finally(function () {
        setLoading(false);
      });
  };

  const fetchTodaysConsensus = () => {
    // TODO need to make this work by date or however we want to fetch new ones each day
    setLoading(true);
    axios
      .get("/api/consensi/today")
      .then(function (response) {
        // handle success
        const tempConsensus: ConsensiRecord = response.data.consensi[0];
        setConsensusTheme(tempConsensus);
        const options = Object.entries(tempConsensus.options);
        // no matter what, set the tiles' displayName and color
        // we will use this to set tiles to the correct color wherever in the app we need to
        setTiles((prevTiles) =>
          prevTiles.map((tile, index) => {
            const [displayName, color] = options[index];
            return {
              ...tile,
              displayName: displayName,
              color: color
            }
          })
        )
        setLoading(false);
      })
      .catch(function (error) {
        setLoading(false);
        // showToast("Error", error, "error");
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
        bgColorMap,
        animateTilesOnSubmit,
        doSubmissionAnimation,
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
