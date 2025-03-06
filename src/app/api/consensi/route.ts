import { Consensi, GameData } from "@/lib/datalayer";
import { getServerSession } from "next-auth";

export async function GET(request: Request) {
    const session = await getServerSession();
    if (!session?.user?.email) {
        return Response.json({ error: "Unauthorized" }, { status: 401 });
    }
    const user = session.user.email;

    try {
        const gameData = new GameData();
        const consensi = new Consensi();
        const allConsensuses = await consensi.getAllConsensiSortedByConsensusNum();

        const consensiList = [];
        for (const consensusData of allConsensuses) {
            const allSubmissions = await gameData.getByConsensusId(consensusData._id.toString());

            // Skip consensuses with no submissions
            if (allSubmissions.length === 0) {
                continue;
            }

            // Calculate aggregated scores
            const consensusValues: Record<string, number> = {};
            Object.keys(consensusData.options).forEach(option => {
                consensusValues[option] = 0;
            });

            allSubmissions.forEach(submission => {
                Object.entries(submission.submission).forEach(([option, rank]) => {
                    switch (rank) {
                        case 1: consensusValues[option] += 4; break;
                        case 2: consensusValues[option] += 3; break;
                        case 3: consensusValues[option] += 2; break;
                        case 4: consensusValues[option] += 1; break;
                    }
                });
            });

            // Sort entries by points (descending) and lex order for ties
            const sortedEntries = Object.entries(consensusValues)
                .sort(([aKey, aVal], [bKey, bVal]) =>
                    bVal - aVal || aKey.localeCompare(bKey)
                )
                .map(([option, points]) => ({ option, points }));

            // Find user's submission
            const userSubmission = allSubmissions.find(sub => sub.metadata.user === user);

            consensiList.push({
                consensusNum: consensusData.consensusNum,
                date: consensusData.metadata.date,
                category: consensusData.category,
                options: consensusData.options,
                submission: userSubmission?.submission || {},
                overall: sortedEntries,
                numSubmissions: allSubmissions.length
            });
        }

        // Check if any consensuses with submissions exist
        if (consensiList.length === 0) {
            return Response.json({ error: "No consensuses found with submissions." }, { status: 404 });
        }

        return Response.json(consensiList);
    } catch (error) {
        return Response.json({ error: "error.message" }, { status: 500 });
    }
}