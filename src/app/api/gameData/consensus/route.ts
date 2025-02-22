import { GameData } from "@/lib/datalayer";

export async function POST(request: Request) {
  // return all consensus score
  const gameData = new GameData();
  const todayConsensus = await request.json();
  const todayRankings = await gameData.getTodaysRankings();
  const todayOptions = todayConsensus.options;
  const consensusValues: Record<string, number> = {
    [todayOptions[0]]: 0,
    [todayOptions[1]]: 0,
    [todayOptions[2]]: 0,
    [todayOptions[3]]: 0,
  };

  todayRankings.forEach((ranking) => {
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

  console.log(consensusValues);

  return Response.json({ consensusValues });
}
