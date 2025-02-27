"use client"
import ConsensiManager from "@/components/ConsensiManager";
import {useEffect, useState} from "react";
import axios from "axios";
import {ConsensiSuggestion} from "@/lib/interfaces";
import {Button} from "@/components/ui/Button";
import GameHeader from "@/components/GameHeader";
import StatsModal from "@/components/StatsModal";
import {ModalProvider} from "@/context/ModalContext";

export default function manageConsensi() {

    //On default display user suggestions, toggle to display AI suggestions
    const [data, setData] = useState<ConsensiSuggestion[]>( []);

    const [userPrompt, setUserPrompt] = useState<String>("");


    // useEffect(() => {
    //     if (!data) {
    //         axios.get("/api/consensiSuggestion")
    //             .then(response => setData(response.data))
    //             .catch(error => console.error("Error fetching data:", error));
    //     }
    // }, []);

    async function sendPrompt() {
        axios.post("/api/gemini", userPrompt)

            .then((response) => {setData(JSON.parse(response.data));})
            .catch(error => console.error("Error fetching data:", error));
    }



    return(
        <>
            <ModalProvider>
                <StatsModal />
                <GameHeader />
                <textarea className="text-black" onChange={e => setUserPrompt(e.target.value)}></textarea>
                <Button onClick={sendPrompt}>submit</Button>
                <ConsensiManager data={data}></ConsensiManager>
            </ModalProvider>
        </>
    );
}