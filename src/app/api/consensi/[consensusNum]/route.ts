import { Consensi } from "@/lib/datalayer";
import { getServerSession } from "next-auth";

export async function GET(
  request: Request,
  context: { params: { consensusNum: number } }
) {
  // return one consensus by consensusNum
  const session = await getServerSession();

  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const params = await context.params;
  const consensusNum = params.consensusNum;
  const consensiDataLayer = new Consensi();
  const consensi = await consensiDataLayer.getTodaysConsensiByNum(consensusNum);
  return Response.json({ consensi });
}
