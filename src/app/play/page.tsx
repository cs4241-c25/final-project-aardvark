"use client";

import GameArea from "@/components/GameArea";
import GameHeader from "@/components/GameHeader";
import LoadingSpinner from "@/components/LoadingSpinner";
import ModalWrapper from "@/components/ModalWrapper";
import SubmitButton from "@/components/SubmitButton";
import { Button } from "@/components/ui/Button";
import { useGameContext } from "@/context/GameContext";
import { ModalProvider } from "@/context/ModalContext";
import { Ranking } from "@/lib/interfaces";
import { useEffect, useState } from "react";

export default function Play() {
  const { tiles, setTiles, submitted, userData, loading } = useGameContext();
  const [localLoading, setLocalLoading] = useState(true);

  useEffect(() => {
    // Function to update tiles based on submission
    const updateTiles = (submission: Ranking) => {
      const updatedTiles = tiles.map((tile) => {
        const displayName = Object.keys(submission).find(
          (key) => submission[key] === tile._id + 1
        );
        return {
          ...tile,
          displayName: displayName || "",
          rank: displayName ? submission[displayName] : undefined,
        };
      });

      setTiles(updatedTiles);
    };
    if (userData.played) {
      updateTiles(userData.played.submission);
      // router.push("/stats");
    }
    setLocalLoading(false);
  }, [userData]);

  return (
    <div className="flex flex-col min-h-screen">
      {loading || localLoading ? (
        <div className="flex h-screen w-screen justify-center items-center">
          <LoadingSpinner />
        </div>
      ) : (
        <ModalProvider>
          <ModalWrapper />
          <GameHeader />
          <div className="flex flex-col flex-grow items-center justify-center">
            <GameArea />
            <div className="flex gap-16 justify-center mt-20">
              <Button
                className="w-28"
                variant="secondary"
                onClick={() =>
                  setTiles((prevTiles) =>
                    prevTiles.map((tile) => ({ ...tile, rank: undefined }))
                  )
                }
                disabled={
                  submitted ||
                  userData.played !== null ||
                  tiles.every((tile) => tile.rank === undefined)
                }
              >
                Clear
              </Button>
              <SubmitButton />
            </div>
          </div>
        </ModalProvider>
      )}
    </div>
  );
}
