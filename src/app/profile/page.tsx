"use client";

import { Button, IconButton } from "@/components/ui/Button";
import { CaretLeft } from "@phosphor-icons/react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Profile() {
  const { data: session } = useSession();
  const router = useRouter();

  return (
    <div className="flex flex-col md:max-w-3xl md:mx-auto md:mt-8">
      <div className="rounded bg-inset p-6">
        <div className="flex gap-4 mb-4 items-center">
          <IconButton
            onClick={() => router.back()}
            className="hover:bg-neutral-700"
            icon={<CaretLeft />}
          />
          <h1 className="font-funnel font-bold uppercase">My Profile</h1>
        </div>
        <div className="flex flex-col md:flex-row md:gap-0 gap-6 justify-between items-center">
          <div className="flex items-center md:gap-6 gap-4 font-funnel">
            <img
              className="rounded-full md:h-full h-16"
              src={
                session && session.user?.image && session?.user.image !== null
                  ? session.user.image
                  : ""
              }
              alt="Profile Image"
            />
            <div>
              <h2 className="md:text-3xl text-xl">{session?.user?.name}</h2>
              <p className="md:text-base text-sm">{session?.user?.email}</p>
            </div>
          </div>
          <Button
            onClick={() => {
              signOut({ redirect: false });
              router.push("/");
            }}
          >
            Log Out
          </Button>
        </div>
      </div>
      <Button onClick={() => router.push("/suggest")}>
        Suggest new Consensus categories!
      </Button>
    </div>
  );
}
