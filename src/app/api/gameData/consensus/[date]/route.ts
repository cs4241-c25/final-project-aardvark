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

  // get all of todays submissions
  const todaysRankings = await gameData.getTodaysRankings();

  // calculate consensus
  const todayOptions = todaysConsensus.options;
  const consensusValues: Record<string, number> = {
    [todayOptions[0]]: 0,
    [todayOptions[1]]: 0,
    [todayOptions[2]]: 0,
    [todayOptions[3]]: 0,
  };

  todaysRankings.forEach((ranking) => {
    Object.entries(ranking.submission).forEach(([key, value]) => {
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
    });
  });

  // sort to find actual consensus ranking
  // in case of a tie, compare string values lexicographically
  // to decide which ranks higher
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

  console.log(consensusData);

  return Response.json({ consensusData });
}
