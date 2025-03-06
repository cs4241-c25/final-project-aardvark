import { getDateString } from "@/utils/dateFormat";
import { getServerSession } from "next-auth";

export async function GET(request: Request) {
  const session = await getServerSession();

  if (!session || !session.user?.email) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const today = new Date();
  console.log(today);
  console.log(today.toISOString());

  const dateString = getDateString(new Date());
  return Response.json({ date: dateString });
}
