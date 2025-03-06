"use client";

import { Button } from "@/components/ui/Button";
import { useRouter } from "next/navigation";

import LoadingSpinner from "@/components/LoadingSpinner";
import { useGameContext } from "@/context/GameContext";
import { signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function Home() {
  const { data: session } = useSession();
  const { userData, loading } = useGameContext();
  const [highlightedIndex, setHighlightedIndex] = useState<number>();
  const [direction, setDirection] = useState("forward"); // Tracks the sweep direction

  const text = "Consensus";
  const colors = ["#11B6EC", "#06D6A0", "#FFD166", "#EF476F"];
  const router = useRouter();

  useEffect(() => {
    let interval: string | number | NodeJS.Timeout | undefined = undefined;

    const startSweep = () => {
      let currentIndex = direction === "forward" ? 0 : text.length - 1;

      interval = setInterval(() => {
        setHighlightedIndex(currentIndex);

        // Update the index based on the direction
        if (direction === "forward") {
          currentIndex++;
          if (currentIndex >= text.length) {
            clearInterval(interval); // Stop the forward sweep
            setTimeout(() => {
              setDirection("backward"); // Change direction after a pause
              startSweep(); // Start the backward sweep
            }, 0); // Pause for 1 second
          }
        } else {
          currentIndex--;
          if (currentIndex < 0) {
            clearInterval(interval); // Stop the backward sweep
            setTimeout(() => {
              setDirection("forward"); // Change direction after a pause
              startSweep(); // Start the forward sweep
            }, 0); // Pause for 1 second
          }
        }
      }, 500); // Adjust the speed of the sweep (e.g., 100ms per letter)
    };

    startSweep(); // Start the initial sweep

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, [text.length, direction]);

  const pickColor = () => {
    const randomIndex = Math.floor(Math.random() * colors.length);
    return colors[randomIndex];
  };

  return (
    <div className="flex flex-col min-h-screen items-center justify-center">
      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          <h1 className="font-funnel font-black text-5xl md:text-8xl">
            {text.split("").map((letter, index) => (
              <span
                key={index}
                className={`inline-block transition-transform duration-300 transform ${
                  highlightedIndex === index ? "hover:-translate-y-2" : ""
                } select-none`}
                style={{
                  color: highlightedIndex === index ? pickColor() : "inherit",
                  transform:
                    highlightedIndex === index
                      ? "translateY(2px)"
                      : "translateY(0)",
                }}
              >
                {letter}
              </span>
            ))}
          </h1>
          <h3 className="font-funnel text-2xl md:text-4xl mt-4 md:w-1/2 w-[75vw] text-center">
            Rank 4 choices and see how you compare to the consensus.
          </h3>
          <div className="flex gap-8 mt-8">
            <Button
              className="w-28"
              variant="secondary"
              onClick={() => {
                if (session && session?.user?.image !== "anonymous") {
                  signOut();
                } else {
                  router.push("/login");
                }
              }}
            >
              {session && session?.user?.image !== "anonymous"
                ? "Log Out"
                : "Log In"}
            </Button>
            <Button className="w-28" onClick={() => router.push("/play")}>
              {userData.played ? "See Stats" : "Play"}
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
