import { Consensi } from "@/lib/datalayer";

export async function GET(
  request: Request,
  { params }: { params: { consensusNum: number } }
) {
  // return one consensus by consensusNum
  const param = await params;
  const consensusNum = await param.consensusNum;
  const consensiDataLayer = new Consensi();
  const consensi = await consensiDataLayer.getTodaysConsensiByNum(consensusNum);
  return Response.json({ consensi });
}
