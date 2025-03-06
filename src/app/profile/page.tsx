"use client"

import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/Button";

export default function Profile() {
  const { data: session } = useSession();

  return (
    <div className="md:max-w-3xl md:mx-auto md:mt-8">
      <div className="flex justify-between items-center p-6 rounded bg-inset">
        <div className="flex items-center md:gap-6 gap-4">
          <img className="rounded-full md:h-full h-16" src={session && session.user?.image && session?.user.image !== null ? session.user.image : ""} alt="Profile Image" />
          <div>
            <h2 className="md:text-3xl text-xl">{session?.user?.name}</h2>
            <p className="md:text-base text-sm">{session?.user?.email}</p>
          </div>
        </div>
        <Button>Log Out</Button>
      </div>
    </div>
  );
}