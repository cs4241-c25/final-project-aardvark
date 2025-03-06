import { getDateString } from "@/utils/dateFormat";
import { getServerSession } from "next-auth";

export async function GET(request: Request) {
  const session = await getServerSession();

  if (!session || !session.user?.email) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  const dateString = getDateString();
  return Response.json({ date: dateString });
}
