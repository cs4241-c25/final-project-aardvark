import { Consensi, GameData } from "@/lib/datalayer";
import { getServerSession } from "next-auth";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ date: string }> }
) {
  // return consensus score
  const session = await getServerSession();

  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const date = (await params).date;

  const gameData = new GameData();
  const consensi = new Consensi();
  // get todays consensus
  const todaysConsensusArr = await consensi.getTodaysConsensiByDate(date);
  const todaysConsensus = todaysConsensusArr[0];

  // get all of today's submissions
  const todaysRankings = await gameData.getTodaysRankings();

  // extract options from object keys
  const todayOptions = Object.keys(todaysConsensus.options);
  const consensusValues: Record<string, number> = Object.fromEntries(
    todayOptions.map((option) => [option, 0])
  );

  todaysRankings.forEach((ranking) => {
    Object.entries(ranking.submission).forEach(([key, value]) => {
      if (consensusValues.hasOwnProperty(key)) {
        switch (value) {
          case 1:
            consensusValues[key] += 4;
            break;
          case 2:
            consensusValues[key] += 3;
            break;
          case 3:
            consensusValues[key] += 2;
            break;
          case 4:
            consensusValues[key] += 1;
        }
      }
    });
  });

  // sort to find actual consensus ranking
  const sortedConsensus = Object.fromEntries(
    Object.entries(consensusValues).sort(
      ([keyA, valueA], [keyB, valueB]) =>
        valueB - valueA || keyB.localeCompare(keyA)
    )
  );

  const consensusData = {
    numSubmissions: todaysRankings.length,
    consensus: sortedConsensus,
  };

  return Response.json({ consensusData });
}