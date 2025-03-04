"use client"
import React, { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, LayersControl } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import * as L from "leaflet";
import "leaflet.heat";

const optionColors = {
    1: "red",
    2: "blue",
    3: "green",
    4: "orange",
};

import {useRouter} from "next/navigation";
import {ConsensiRecord, GameDataRecord} from "@/lib/interfaces";
import {ModalProvider} from "@/context/ModalContext";
import axios from "axios";

export default function HeatMap() {

    const router = useRouter();

    const mapRef = useRef(null);
    const [gameData, setGameData] = useState<GameDataRecord[]>([]);
    const [activeOption, setActiveOption] = useState(null);

    useEffect(() => {
        if (!mapRef.current) return;
        const map = mapRef.current;

        // Clear previous layers
        map.eachLayer(layer => {
            if (layer instanceof L.LayerGroup) map.removeLayer(layer);
        });

        // Create layer groups for each answer option
        const layers = {};
        Object.keys(optionColors).forEach(option => {
            layers[option] = L.layerGroup().addTo(map);
        });

        //Set gameData
        try{
            axios.get("")
        }catch(e){
            console.error(e);
        }

        // Add heatmap points per category
        pins.forEach(pin => {
            if (!pin.answer || !optionColors[pin.answer]) return;

            const heatLayer = L.heatLayer([[pin.lat, pin.lon, 1]], {
                radius: 20,
                blur: 15,
                gradient: { 0.4: optionColors[pin.answer], 1: optionColors[pin.answer] },
            });

            layers[pin.answer].addLayer(heatLayer);
        });

        return () => {
            Object.values(layers).forEach(layer => map.removeLayer(layer));
        };
    }, [pins, activeOption]);

    return(
        <ModalProvider>
            <div>
                {/* Option Filter */}
                <div style={{marginBottom: "10px"}}>
                    <label>Filter by Answer: </label>
                    <select onChange={e => setActiveOption(e.target.value)} defaultValue="">
                        <option value="">All</option>
                        {Object.entries(optionColors).map(([option, color]) => (
                            <option key={option} value={option}>
                                Option {option} ({color})
                            </option>
                        ))}
                    </select>
                </div>

                {/* Map */}
                <MapContainer
                    center={[20, 0]}
                    zoom={2}
                    style={{height: "500px", width: "100%"}}
                    whenCreated={map => (mapRef.current = map)}
                >
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; OpenStreetMap contributors'
                    />
                </MapContainer>
            </div>
        </ModalProvider>
    )

}