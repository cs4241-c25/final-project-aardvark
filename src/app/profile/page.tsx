"use client";

import LoadingSpinner from "@/components/LoadingSpinner";
import { Button, IconButton } from "@/components/ui/Button";
import { CaretLeft } from "@phosphor-icons/react";
import axios from "axios";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
export default function Profile() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [admin, setAdmin] = useState(false);

  useEffect(() => {
    if (status === "loading") return;

    async function checkAdmin() {
      let res;
      try {
        await axios.get("/api/admin/check").then((response) => {
          res = response.data;
          setAdmin(true);
        });
        setLoading(false);
      } catch (error) {
        setAdmin(false);
      }
    }

    checkAdmin();
  }, [status]);

  return (
    <div className="flex flex-col md:max-w-3xl md:mx-auto md:mt-8">
      {loading ? (
        <div className="w-screen h-screen flex justify-center items-center">
          <LoadingSpinner />
        </div>
      ) : (
        <>
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
                    session &&
                    session.user?.image &&
                    session?.user.image !== null
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
              {admin && (
                <Button onClick={() => router.push("/admin")}>
                  Admin Dashboard
                </Button>
              )}
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
        </>
      )}
    </div>
  );
}
