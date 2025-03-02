"use client";

import { useGameContext } from "@/context/GameContext";
import { useEffect } from "react";

export default function Stats() {
  const { userData } = useGameContext();

  useEffect(() => {
    console.log(userData);
  }, []);

  return <p>stats</p>;
}
