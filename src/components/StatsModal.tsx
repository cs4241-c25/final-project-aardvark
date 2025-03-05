import { useGameContext } from "@/context/GameContext";
import { useModal } from "@/context/ModalContext";
import { useToast } from "@/context/ToastContext";
import { ShareNetwork } from "@phosphor-icons/react";
import clsx from "clsx";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Button } from "./ui/Button";
import Modal from "./ui/Modal";

export default function StatsModal() {
  const { closeModal } = useModal();
  const { tiles, todaysConsensus, userData, bgColorMap } = useGameContext();
  const { data: session } = useSession();
  const { showToast } = useToast();
  const sortedUserRanking = [...tiles].sort(
    (a, b) => (a.rank ?? 5) - (b.rank ?? 5)
  );
  const { consensusTheme } = useGameContext();
  const formattedConsensusNum = (num: number) => {
    if (num > 99) {
      return String(num);
    } else if (num > 9) {
      return String(num).padStart(2, "0");
    } else {
      return String(num).padStart(3, "0");
    }
  };

  const sortedConsensusKeys = Object.entries(todaysConsensus?.consensus || {})
    .sort(([, a], [, b]) => b - a)
    .map(([key]) => key);

  const tileColorMap = Object.fromEntries(
    tiles.map((tile) => [tile.displayName, tile.color])
  );

  const emojiMap: Record<string, string> = {
    blue: "🟦",
    green: "🟩",
    yellow: "🟨",
    red: "🟥",
  };

  const copyShare = () => {
    let returnStr = `Consensus #${formattedConsensusNum(
      Number(consensusTheme?.consensusNum)
    )} - ${consensusTheme?.category}\n\n`;
    let i = 1;
    Object.entries(tileColorMap).forEach(([key, value]) => {
      returnStr += `${i} ${emojiMap[value]} ${key}\n`;
      i++;
    });
    returnStr += `\nWhat do you think? Play here: https://consensus-game.vercel.app`;
    navigator.clipboard.writeText(returnStr);
    showToast(
      "Successfully copied to clipboard 🔗",
      "Share it with all your friends!"
    );
  };

  return (
    <Modal
      title={`#${formattedConsensusNum(
        Number(consensusTheme?.consensusNum)
      )} - ${consensusTheme?.category}`}
      onClose={closeModal}
      className="w-full max-w-2xl"
    >
      <div className="grid grid-cols-[1fr_auto_1fr] gap-x-4 gap-y-6 px-4 pt-8">
        <div className="flex justify-center items-center">
          <div className="text-center font-funnel">
            <p className="font-bold text-6xl">
              {todaysConsensus
                ? (((userData?.score ?? 0) / 24) * 100).toFixed(0)
                : 0}
              %
            </p>
            <p className="uppercase">Similarity Score</p>
          </div>
        </div>
        <div></div>
        <div className="flex justify-center items-center">
          <div className="text-center font-funnel">
            <p className="font-bold text-6xl">
              {todaysConsensus?.numSubmissions || 0}
            </p>
            <p className="uppercase">Plays Today</p>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          {sortedUserRanking.length > 0
            ? sortedUserRanking.map((tile) => (
                <div
                  key={tile._id}
                  className={clsx(
                    "rounded py-1 text-center text-black uppercase font-bold font-funnel text-lg",
                    bgColorMap.get(tile.color)
                  )}
                >
                  {tile.displayName}
                </div>
              ))
            : null}
          <p className="text-center uppercase font-funnel">Your Ranking</p>
        </div>
        <div className="flex flex-col gap-2 font-bold text-lg">
          <p className="py-1">1</p>
          <p className="py-1">2</p>
          <p className="py-1">3</p>
          <p className="py-1">4</p>
        </div>
        <div className="flex flex-col gap-2">
          {sortedConsensusKeys.length > 0
            ? sortedConsensusKeys.map((displayName) => {
                const color = tileColorMap[displayName] || "bg-gray-300";
                return (
                  <div
                    key={displayName}
                    className={clsx(
                      "rounded py-1 text-center text-black uppercase font-bold font-funnel text-lg",
                      bgColorMap.get(color)
                    )}
                  >
                    {displayName}
                  </div>
                );
              })
            : null}
          <p className="text-center uppercase font-funnel">
            {"Today's Consensus"}
          </p>
        </div>
        <div className="flex justify-center items-center">
          <Button variant="secondary" onClick={copyShare}>
            <ShareNetwork size={22} />
            Share
          </Button>
        </div>
        <div></div>
        <div className="flex justify-center items-center">
          {session && session?.user?.image !== "anonymous" ? (
            <Button variant="secondary">See Stats</Button>
          ) : (
            <p className="font-funnel">
              <Link className="underline" href="/login">
                Log in
              </Link>{" "}
              to see more statistics!
            </p>
          )}
        </div>
      </div>
    </Modal>
  );
}
