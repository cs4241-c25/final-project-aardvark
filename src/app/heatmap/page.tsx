"use client";

import React, { useEffect, useRef, useMemo, useState } from "react";
import {MapContainer, Marker, Popup, TileLayer} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { ModalProvider } from "@/context/ModalContext";
import L from "leaflet";
import ModalWrapper from "@/components/ModalWrapper";
import GameHeader from "@/components/GameHeader";
import { ConsensiRecord, GameDataRecord } from "@/lib/interfaces";
import axios from "axios";
import { useGameContext } from "@/context/GameContext";

interface Pin {
    location: {
        lat: number;
        lng: number;
    };
    topAnswer: string;
}

export default function HeatMap() {
    const mapRef = useRef<L.Map | null>(null);

    const [data, setData] = useState<ConsensiRecord[]>([]);
    const { todaysConsensus, consensusTheme } = useGameContext();
    const [pins, setPins] = useState<Pin[]>([]); // ✅ Initialized as an empty array

    console.log("Todays consensus: ", todaysConsensus);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get("/api/gameData/consensus");
                setData(response.data.result);
                console.log(response.data);

                // Extract Pins
                const extractedPins = response.data.result
                    .map((record: GameDataRecord) => {
                        const { location, submission } = record;

                        const topAnswer = Object.keys(submission).find(
                            (key) => submission[key] === 4
                        );

                        return topAnswer ? { location, topAnswer } : null;
                    })
                    .filter(Boolean) as Pin[];

                setPins(extractedPins);
            } catch (err) {
                console.error("Error fetching data:", err);
            }
        };

        fetchData();
    }, []);

    const tileLayer = useMemo(
        () => (
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="&copy; OpenStreetMap contributors"
            />
        ),
        []
    );

    return (
        <ModalProvider>
            <ModalWrapper/>
            <GameHeader/>
            <div className="flex flex-col items-center justify-center min-h-screen p-6">
                {pins.length === 0 ? (
                    <p>Loading...</p> // Show loading text
                ) : (
                    <MapContainer
                        center={[20, 0]}
                        zoom={2}
                        style={{height: "900px", width: "100%"}}
                        ref={mapRef}
                        preferCanvas={true}
                    >
                        {tileLayer}
                        {pins.map((pin, index) => (
                            <Marker
                                key={index}
                                position={[pin.location.lat, pin.location.lng]}
                            >
                                <Popup>{pin.topAnswer}</Popup>
                            </Marker>
                        ))}
                    </MapContainer>
                )}
            </div>
        </ModalProvider>
    );
}
