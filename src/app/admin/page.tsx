"use client";
import ConsensiManager from "@/components/ConsensiManager";
import GameHeader from "@/components/GameHeader";
import LoadingSpinner from "@/components/LoadingSpinner"; // Import spinner icon
import ModalWrapper from "@/components/ModalWrapper";
import { ModalProvider } from "@/context/ModalContext";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function manageConsensi() {
  const { status } = useSession();

  const [userAuthLoad, setUserAuthLoad] = useState(true);

  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;

    async function checkAdmin() {
      let res;
      try {
        await axios.get("/api/admin/check").then((response) => {
          res = response.data;
        });
        setUserAuthLoad(false);
      } catch (error) {
        router.replace("/");
      }
    }

    checkAdmin();
  }, [status]);

  return (
    <>
      <ModalProvider>
        <ModalWrapper />
        <GameHeader />
        {userAuthLoad ? (
          <div className="w-screen h-screen flex justify-center items-center">
            <LoadingSpinner />
          </div>
        ) : (
          <div className="flex flex-col flex-grow items-center justify-center font-funnel">
            <h1 className="text-3xl font-bold mb-4 mt-4">
              Consensus Suggestion Manager
            </h1>
            <p className="max-w-[75vw] md:max-w-[50vw] text-center">
              Accept or Reject Consensus suggestions from users, or generate
              your own using ai. See the current Consensus queue and create your
              own.
            </p>
            <ConsensiManager></ConsensiManager>
          </div>
        )}
      </ModalProvider>
    </>
  );
}
