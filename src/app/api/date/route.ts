import { getDateString } from "@/utils/dateFormat";
import { getServerSession } from "next-auth";

export async function GET(request: Request) {
  const session = await getServerSession();

  if (!session || !session.user?.email) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const today = new Date();
  const newDate = new Date(today.getTime() - 5 * 60 * 60 * 1000);

  console.log(newDate.toISOString());

  const dateString = getDateString(new Date());
  return Response.json({ date: dateString });
}
