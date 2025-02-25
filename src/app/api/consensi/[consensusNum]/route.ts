import { Consensi } from "@/lib/datalayer";
import { getServerSession } from "next-auth";

export async function GET(
  _request: Request,
  { params }: { params: { consensusNum: number } }
) {
  // return one consensus by consensusNum
  const session = await getServerSession();

  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const param = await params;
  const consensusNum = await param.consensusNum;
  const consensiDataLayer = new Consensi();
  const consensi = await consensiDataLayer.getTodaysConsensiByNum(consensusNum);
  return Response.json({ consensi });
}
