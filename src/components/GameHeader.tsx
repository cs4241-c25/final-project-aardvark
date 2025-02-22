"use client";

import { motion } from "motion/react";
import { IconButton } from "./ui/Button";
import { ClockCounterClockwise, ChartBar, Question, UserCircle } from "@phosphor-icons/react";

export default function GameHeader({ category }: { category: string }) {
  return (
    <header className="flex px-2 md:px-4 border-b border-inset py-2">
      <div className="md:flex items-center">
        <h1 className="font-funnel font-black text-2xl md:text-4xl md:border-r pr-4">Consensus</h1>
        <p className="md:text-base text-sm md:ml-4">#001 - {category}</p>
      </div>
      <div className="flex flex-grow justify-end items-center gap-1">
        <IconButton title="Archive" icon={<ClockCounterClockwise size={24} />} /> {/* goes to consensus archive- TODO: create page */}
        <IconButton title="Today's Statistics" icon={<ChartBar size={24} />} />   {/* goes to statistics for today's consensus- TODO: create page */}
        <IconButton title="How to Play" icon={<Question size={24} />} />          {/* opens how to play modal- TODO: create modal */}
        <IconButton title="My Profile" icon={<UserCircle size={24} />} />         {/* goes to user profile page- TODO: create page */}
      </div>
    </header>
  );
}