import { Consensi } from "@/lib/datalayer";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

const consensi = new Consensi();

export async function GET() {
  const session = await getServerSession();

  if (
    !session ||
    session.user?.image === "anonymous" ||
    (session.user?.email !== process.env.NEXT_PUBLIC_ARI_ADMIN &&
      session.user?.email !== process.env.NEXT_PUBLIC_JACK_ADMIN &&
      session.user?.email !== process.env.NEXT_PUBLIC_GUS_ADMIN &&
      session.user?.email !== process.env.NEXT_PUBLIC_WALDEN_ADMIN &&
      session.user?.email !== process.env.NEXT_PUBLIC_STEVE_ADMIN &&
      session.user?.email !== process.env.NEXT_PUBLIC_BMO_ADMIN)
  ) {
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

  if (
    !session ||
    session.user?.image === "anonymous" ||
    (session.user?.email !== process.env.NEXT_PUBLIC_ARI_ADMIN &&
      session.user?.email !== process.env.NEXT_PUBLIC_JACK_ADMIN &&
      session.user?.email !== process.env.NEXT_PUBLIC_GUS_ADMIN &&
      session.user?.email !== process.env.NEXT_PUBLIC_WALDEN_ADMIN &&
      session.user?.email !== process.env.NEXT_PUBLIC_STEVE_ADMIN &&
      session.user?.email !== process.env.NEXT_PUBLIC_BMO_ADMIN)
  ) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await request.json();
    const consensusDate = data.metadata.date;
    // console.log("date", consensusDate);
    const existingConsensus = await consensi.getTodaysConsensiByDate(
      consensusDate
    );
    // console.log("existing:", existingConsensus);
    if (existingConsensus.length > 0) {
      return NextResponse.json(
        { error: "Consensus already scheduled for that day" },
        { status: 400 }
      );
    }

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
