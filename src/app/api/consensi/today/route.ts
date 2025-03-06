import { Consensi } from "@/lib/datalayer";
import { getDateString } from "@/utils/dateFormat";
import { getServerSession } from "next-auth";

const consensiDataLayer = new Consensi();

export async function GET(request: Request) {
  // return one consensus by consensusNum
  const session = await getServerSession();

  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const today = getDateString();
  const consensi = await consensiDataLayer.getTodaysConsensiByDate(today);
  return Response.json({ consensi });
}
