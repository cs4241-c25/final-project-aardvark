"use client";

import GameArea from "@/components/GameArea";
import GameHeader from "@/components/GameHeader";
import LoadingSpinner from "@/components/LoadingSpinner";
import StatsModal from "@/components/StatsModal";
import SubmitButton from "@/components/SubmitButton";
import { Button } from "@/components/ui/Button";
import { useGameContext } from "@/context/GameContext";
import { ModalProvider } from "@/context/ModalContext";

export default function Play() {
  const { tiles, setTiles, submitted, loading } = useGameContext();

  return (
    <div className="flex flex-col min-h-screen">
      {loading ? (
        <div className="flex h-screen w-screen justify-center items-center">
          <LoadingSpinner />
        </div>
      ) : (
        <ModalProvider>
          <StatsModal />
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
                  submitted || tiles.every((tile) => tile.rank === undefined)
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
