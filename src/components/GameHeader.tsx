"use client";

import { useGameContext } from "@/context/GameContext";
import { ModalProvider, useModal } from "@/context/ModalContext";
import {
  ChartBar,
  ClockCounterClockwise,
  Question,
  UserCircle,
} from "@phosphor-icons/react";
import { Button, IconButton } from "./ui/Button";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function GameHeader() {
  const { consensusTheme } = useGameContext();
  const formattedConsensusNum = (num: number) => String(num).padStart(3, "0");
  const { openModal } = useModal();
  const router = useRouter();
  const { data: session } = useSession();

  return (
    <header className="flex px-2 md:px-4 border-b border-inset py-2">
      <div className="md:flex items-center">
        <h1 className="font-funnel font-black text-2xl md:text-4xl md:border-r pr-4">
          Consensus
        </h1>
        <p className="md:text-base text-sm md:ml-4 font-funnel">
          #{formattedConsensusNum(Number(consensusTheme?.consensusNum))} -{" "}
          {consensusTheme?.category}
        </p>
      </div>
      <ModalProvider>
        <div className="flex flex-grow justify-end items-center gap-2">
          <IconButton
            title="Archive"
            icon={<ClockCounterClockwise size={24} />}
          />
          {/* goes to consensus archive- TODO: create page */}
          {/* <IconButton
            title="Today's Statistics"
            icon={<ChartBar size={24} />}
          /> */}
          {/* goes to statistics for today's consensus- TODO: create page */}
          <IconButton
            title="How to Play"
            icon={<Question size={24} />}
            onClick={() => openModal("How to Play")}
          />
          {/* opens how to play modal- TODO: create modal */}
          {session?.user?.image !== "anonymous" ? (
            <IconButton
              title="My Profile"
              icon={<UserCircle size={24}
              onClick={() => router.push("/profile")}
            />} />
          ) : (
            <Button variant="secondary" className="ml-1" onClick={() => router.push("/login")}>Log In</Button>
          )}
        </div>
      </ModalProvider>
    </header>
  );
}