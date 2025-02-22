import { NextResponse } from "next/server";
import { GameData } from "@/lib/dataLayer";

export async function getData() {
    try {
        const gameData = new GameData();
        const response = await gameData.getData();
        return NextResponse.json({ success: true, data: response }, { status: 200 });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: "Failed to fetch game data" }, { status: 500 });
    }
}

export async function getDataByUsername(username: string)  {
    try {
        const gameData = new GameData();
        const response = await gameData.getByUsername(username);
        return NextResponse.json({ success: true, data: response }, { status: 200 });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: "Failed to fetch game data" }, { status: 500 });
    }
}

export async function getDataByDate(date: Date) {
    try {
        const gameData = new GameData();
        const response = await gameData.getTodaysRankings(date);
        return NextResponse.json({ success: true, data: response }, { status: 200 });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: "Failed to fetch game data" }, { status: 500 });
    }
}


export async function POST() {}
