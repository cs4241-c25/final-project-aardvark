import { NextResponse } from "next/server";
import { Consensi } from "@/lib/datalayer";

const consensi = new Consensi();

export async function GET() {
  try {
    const highestConsensusNum = await consensi.getHighestConsensusNum();
    return NextResponse.json({ highestConsensusNum });
  } catch (error) {
    console.error("Error fetching highest consensus number:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    console.log("Received data:", data);

    await consensi.saveConsensus(data);
    return NextResponse.json({ message: "Consensus saved successfully", consensusData: data });
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
}
