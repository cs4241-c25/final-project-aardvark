import { useModal } from "@/context/ModalContext";
import clsx from "clsx";
import { Share2 } from "lucide-react";
import { Button } from "./ui/Button";
import Modal from "./ui/Modal";

import { useGameContext } from "@/context/GameContext";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function StatsModal() {
  const { closeModal } = useModal();
  const { todaysConsensus, userData } = useGameContext();
  const [sortedConsensusKeys, setSortedConsensusKeys] = useState<string[]>([]);

  useEffect(() => {
    if (todaysConsensus) {
      setSortedConsensusKeys(Object.keys(todaysConsensus.consensus));
    }
  }, [todaysConsensus]);

  return (
    <Modal onClose={closeModal} className="w-full max-w-2xl">
      <div className="grid grid-rows-1 grid-cols-2 gap-6 mb-6">
        <div>
          <div className="relative py-5 border border-foreground rounded-sm mb-6">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-background dark:bg-neutral-900 px-2 text-sm uppercase">
              {"Today's Stats"}
            </div>
            <div className="flex items-end justify-around text-center">
              <div>
                <p className="text-4xl font-bold">
                  {todaysConsensus?.numSubmissions}
                </p>
                <p className="text-xs">Total plays today</p>
              </div>
              <div>
                <p className="text-4xl font-bold">
                  {todaysConsensus
                    ? (((userData?.score ?? 0) / 24) * 100).toFixed(0)
                    : 0}
                  %
                </p>
                <p className="text-xs">Your similarity score</p>
              </div>
            </div>
          </div>
          <div className="relative py-5 border border-foreground rounded-sm">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-background dark:bg-neutral-900 px-2 text-sm uppercase">
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
        <div className="flex flex-col">
          <div>
            <h1 className="text-center font-funnel uppercase mb-2">
              {"Today's Consensus"}
            </h1>
          </div>
          <div className="flex flex-grow flex-col justify-around gap-2">
            {sortedConsensusKeys.map((key, index) => {
              const color = `bg-rank${index + 1}`;
              return (
                <div
                  key={key}
                  className={clsx(
                    "rounded py-1 uppercase text-center dark:text-background",
                    color
                  )}
                >
                  {key}
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 grid-rows-1 mb-3">
        <div className="flex justify-center items-center">
          <p className="text-sm">
            <Link className="underline" href="/">
              Log in
            </Link>{" "}
            to save your results
          </p>
        </div>
        <div className="flex justify-center items-center">
          <Button variant="secondary">
            <Share2 className="mr-2" /> Share my ranking
          </Button>
        </div>
      </div>
    </Modal>
  );
}
