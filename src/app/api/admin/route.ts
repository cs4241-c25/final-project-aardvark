import { Consensi } from "@/lib/datalayer";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

const consensi = new Consensi();

export async function GET() {
  const session = await getServerSession();

  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const highestConsensusNum = await consensi.getHighestConsensusNum();
    return NextResponse.json({ highestConsensusNum });
  } catch (error) {
    console.error("Error fetching highest consensus number:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const session = await getServerSession();

  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await request.json();
    console.log("Received data:", data);

    await consensi.saveConsensus(data);
    return NextResponse.json({
      message: "Consensus saved successfully",
      consensusData: data,
    });
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
}
