"use client"
import ConsensiManager from "@/components/ConsensiManager";
import {useEffect, useState} from "react";
import axios from "axios";
import {ConsensiRecord, ConsensiSuggestion} from "@/lib/interfaces";
import {Button} from "@/components/ui/Button";
import GameHeader from "@/components/GameHeader";
import {ModalProvider} from "@/context/ModalContext";
import { Loader2 } from "lucide-react";
import ModalWrapper from "@/components/ModalWrapper";
import {Input} from "@/components/ui/input";
import {useSession} from "next-auth/react";
import {useRouter} from "next/navigation"
import LoadingSpinner from "@/components/LoadingSpinner"; // Import spinner icon



export default function manageConsensi() {

    const [data, setData] = useState<ConsensiSuggestion[]>( []);

    const [userPrompt, setUserPrompt] = useState<String>("");

    const [loading, setLoading] = useState<boolean>(false);

    const { data: session, status } = useSession();

    const [userAuthLoad, setUserAuthLoad] = useState(true);

    const router = useRouter();

    useEffect(() => {
        if (status === "loading") return;

        async function checkAdmin() {
            let res;
            await axios.get("/api/admin/check").then((response) => {res = response.data});

            if (res!.message != "Authorized") {
                router.replace("/");
            } else {
                setUserAuthLoad(false);
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


    return(
        <>
            <ModalProvider>
                <ModalWrapper/>
                <GameHeader/>
                    {userAuthLoad ? (
                        <LoadingSpinner />
                    ) : (
                <div className="flex flex-col flex-grow items-center justify-center">
                    <h2>Consensus Suggestion Manager</h2>
                    <p>Accept or Reject Consensus suggestions from users, or generate your own using ai. See the current
                    Consensus queue and create your own.</p>
                    <ConsensiManager aiSuggestions={data}></ConsensiManager>
                    {loading &&
                        <div className="flex justify-center mt-4"><Loader2 className="animate-spin text-white h-8 w-8"/>
                        </div>}
                    <p className="m-5">Enter a category in the box below to generate new consensus options.</p>
                    <textarea placeholder="Enter your desired category"
                           onChange={e => setUserPrompt(e.target.value)}
                           className="border border-white text-white bg-transparent m-2 rounded-md w-[250px]">
                    </textarea>
                    <Button onClick={sendPrompt}>Generate</Button>
                </div>
                        )}

            </ModalProvider>
        </>
    );
}