"use client";

import GameArea from "@/components/GameArea";
import GameHeader from "@/components/GameHeader";
import Button from "@/components/ui/Button";
import { useGameContext } from "@/context/GameContext";

export default function Home() {
  const { tiles, setTiles } = useGameContext();

  return (
    <div className="flex flex-col min-h-screen">
      <GameHeader category="Seasons"></GameHeader>
      <div className="flex flex-col flex-grow items-center justify-center">
        <GameArea></GameArea>
        <div className="flex gap-16 justify-center mt-20">
          <Button
            className="w-28"
            variant="secondary"
            onClick={() =>
              setTiles((prevTiles) =>
                prevTiles.map((tile) => ({ ...tile, rank: undefined }))
              )
            }
            disabled={tiles.every((tile) => tile.rank === undefined)}
          >
            Clear
          </Button>

          {/* submit button should be its own component eventually */}
          <Button
            className="w-28"
            disabled={tiles.some((tile) => tile.rank === undefined)}
          >
            Submit
          </Button>
        </div>
      </div>
    </div>
  );
}
