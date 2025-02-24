"use client";

import GameArea from "@/components/GameArea";
import GameHeader from "@/components/GameHeader";
import StatsModal from "@/components/StatsModal";
import SubmitButton from "@/components/SubmitButton";
import { Button } from "@/components/ui/Button";
import { useGameContext } from "@/context/GameContext";
import { ModalProvider } from "@/context/ModalContext";
import { useToast } from "@/context/ToastContext";

export default function Play() {
  const { tiles, setTiles, submitted } = useGameContext();
  const { showToast } = useToast();

  return (
    <div className="flex flex-col min-h-screen">
      <ModalProvider>
        <StatsModal />
        <GameHeader category="Seasons" />
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
    </div>
  );
}
