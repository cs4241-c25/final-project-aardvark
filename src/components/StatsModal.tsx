import Modal from "./ui/Modal";
import Button from "./ui/Button";
import { Share2 } from "lucide-react";
import { useModal } from "@/context/ModalContext";
import clsx from "clsx";

import { Tile } from "@/context/GameContext";

export default function StatsModal() {
  const { isOpen, closeModal } = useModal(); 

  const dummyRanking: Tile[] = [
    { _id: 0, displayName: "spring", rank: 4 },
    { _id: 1, displayName: "summer", rank: 1 },
    { _id: 2, displayName: "fall", rank: 2 },
    { _id: 3, displayName: "winter", rank: 3 },
  ]

  return (
    <Modal isOpen={isOpen} onClose={closeModal}>
      <div className="grid grid-rows-1 grid-cols-2 gap-6 mb-4">
        <div>
          <div className="relative py-5 border border-foreground rounded-sm mb-6">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-neutral-900 px-2 text-sm uppercase">
              Today's Stats
            </div>
            <div className="flex items-end justify-around text-center">
              <div>
                <p className="text-4xl font-bold">5,192</p>
                <p className="text-xs">Total plays today</p>
              </div>
              <div>
                <p className="text-4xl font-bold">67%</p>
                <p className="text-xs">Your similarity score</p>
              </div>
            </div>
          </div>
          <div className="relative py-5 border border-foreground rounded-sm">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-neutral-900 px-2 text-sm uppercase">
              Your Stats
            </div>
            <div className="flex items-end justify-around text-center">
              <div>
                <p className="text-4xl font-bold">100</p>
                <p className="text-xs">Total plays</p>
              </div>
              <div>
                <p className="text-4xl font-bold">5</p>
                <p className="text-xs">Current streak</p>
              </div>
              <div>
                <p className="text-4xl font-bold">18</p>
                <p className="text-xs">Best streak</p>
              </div>
            </div>
          </div>
        </div>
        <div>
          <div className="h-full flex flex-col justify-center gap-2">
            <h1 className="text-center font-funnel uppercase mb-2">Today's most common ranking</h1>
            {[1,2,3,4].map((rank) => {
              const matchingTile = dummyRanking.find((tile) => tile.rank === rank);
              const color = `bg-rank${rank}`;
              return (
                <div key={rank} className={clsx("rounded py-1 uppercase text-center dark:text-background", color)}>
                  {matchingTile?.displayName}
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div className="h-12 flex items-center justify-center">
        <Button variant="secondary"><Share2 className="mr-2" /> Share</Button>
      </div>
    </Modal>
  );
}