"use client";

import { Button } from "@/components/ui/Button";
import { useRouter } from "next/navigation";

import LoadingSpinner from "@/components/LoadingSpinner";
import { useGameContext } from "@/context/GameContext";
import { signOut, useSession } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();
  const { userData, loading } = useGameContext();

  const text = "Consensus";
  const colors = ["#11B6EC", "#06D6A0", "#FFD166", "#EF476F"];
  const router = useRouter();

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
                className="inline-block transition-transform duration-300 transform hover:-translate-y-2 select-none"
                style={{ color: "inherit" }} // Default color
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = pickColor(); // Change color on hover
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "inherit"; // Reset color when not hovered
                }}
              >
                {letter}
              </span>
            ))}
          </h1>
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
            <Button
              className="w-28"
              onClick={() => router.push("/play")}
            >
              {userData.played ? "See Stats" : "Play"}
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
