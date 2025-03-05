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
import { useModal } from "@/context/ModalContext";
import { useSession } from "next-auth/react";

function PlayContent() {
  const { tiles, setTiles, submitted, userData, loading, todaysConsensus } = useGameContext();
  const { openModal } = useModal();
  const { data: session } = useSession();

  useEffect(() => {
    if (submitted !== null) {
      if (submitted && todaysConsensus) {
        openModal("Statistics");
      }
      if (session && !submitted && session.user?.image === "anonymous") {
        openModal("How to Play");
      }
    }
  }, [submitted, todaysConsensus, session]);

  return (
    <div className="flex flex-col min-h-screen">
      {loading ? (
        <div className="flex h-screen w-screen justify-center items-center">
          <LoadingSpinner />
        </div>
      ) : (
        <>
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
        </>
      )}
    </div>
  );
}

export default function Play() {
  return (
    <ModalProvider>
      <ModalWrapper />
      <PlayContent />
    </ModalProvider>
  );
}
