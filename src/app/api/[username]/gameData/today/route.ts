import { GameData } from "@/lib/datalayer";
import { getDateString } from "@/utils/dateFormat";
import { getServerSession } from "next-auth";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ username: string }> }
) {
  // return user submission if they played today
  const session = await getServerSession();

  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const gameData = new GameData();

  const username = (await params).username;
  const today = getDateString();
  const result = await gameData.getByUsernameAndDate(username, today);
  return Response.json({ result });
}
