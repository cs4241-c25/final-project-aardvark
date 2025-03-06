"use client";
import ConsensiManager from "@/components/ConsensiManager";
import GameHeader from "@/components/GameHeader";
import LoadingSpinner from "@/components/LoadingSpinner"; // Import spinner icon
import ModalWrapper from "@/components/ModalWrapper";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/textarea";
import { ModalProvider } from "@/context/ModalContext";
import { ConsensiSuggestion } from "@/lib/interfaces";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function manageConsensi() {
  const [data, setData] = useState<ConsensiSuggestion[]>([]);

  const [userPrompt, setUserPrompt] = useState<String>("");

  const [loading, setLoading] = useState<boolean>(false);

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

  async function sendPrompt() {
    setLoading(true);
    try {
      const response = await axios.post("/api/gemini", userPrompt);
      setData(JSON.parse(response.data));
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }

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
            <ConsensiManager aiSuggestions={data}></ConsensiManager>
            {loading && (
              <div className="flex justify-center mt-4">
                <Loader2 className="animate-spin text-white h-8 w-8" />
              </div>
            )}
            <p className="m-5">
              Enter a category in the box below to generate new consensus
              options.
            </p>
            <Textarea
              placeholder="Enter your desired category"
              onChange={(e) => setUserPrompt(e.target.value)}
              className="border border-white text-white bg-transparent m-2 w-[600px] rounded-md mb-4"
            ></Textarea>
            <Button onClick={sendPrompt}>Generate</Button>
          </div>
        )}
      </ModalProvider>
    </>
  );
}
