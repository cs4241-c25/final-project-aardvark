import { GameData } from "@/lib/datalayer";
import { getServerSession } from "next-auth";

export async function GET(_request: Request) {
  // return all gameData submissions
  const session = await getServerSession();

  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const gameData = new GameData();
  const result = await gameData.getAllRankings();
  return Response.json({ result });
}

export async function POST(request: Request) {
  // save gameData submission
  const session = await getServerSession();

  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const gameData = new GameData();
  const result = await gameData.addNewSubmission(body);
  return Response.json({ result });
}
