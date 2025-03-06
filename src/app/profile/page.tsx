"use client"

import { useSession, signOut } from "next-auth/react";
import { Button, IconButton } from "@/components/ui/Button";
import { CaretLeft } from "@phosphor-icons/react";
import { useRouter } from "next/navigation";

export default function Profile() {
  const { data: session } = useSession();
  const router = useRouter();

  return (
    <div className="md:max-w-3xl md:mx-auto md:mt-8">
      <div className="rounded bg-inset p-6">
        <div className="flex gap-4 mb-4 items-center">
          <IconButton onClick={() => router.back()} className="hover:bg-neutral-700" icon={<CaretLeft />} />
          <h1 className="font-funnel font-bold uppercase">My Profile</h1>
        </div>
        <div className="flex justify-between items-center">
          <div className="flex items-center md:gap-6 gap-4 font-funnel">
            <img className="rounded-full md:h-full h-16" src={session && session.user?.image && session?.user.image !== null ? session.user.image : ""} alt="Profile Image" />
            <div>
              <h2 className="md:text-3xl text-xl">{session?.user?.name}</h2>
              <p className="md:text-base text-sm">{session?.user?.email}</p>
            </div>
          </div>
          <Button onClick={() => {
            signOut({ redirect: false });
            router.push("/");
          }}>Log Out</Button>
        </div>
      </div>
    </div>
  );
}