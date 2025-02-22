import { GameData } from "@/lib/datalayer";

export async function GET(request: Request) {
  // return all gameData submissions
  const gameData = new GameData();
  const result = await gameData.getAllRankings();
  return Response.json({ result });
}

export async function POST(request: Request) {
  // save gameData submission
  const body = await request.json();
  const gameData = new GameData();
  const result = await gameData.addNewSubmission(body);
  return Response.json({ result });
}
