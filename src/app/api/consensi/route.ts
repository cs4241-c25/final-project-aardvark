import { Consensi, GameData } from "@/lib/datalayer";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const session = await getServerSession();
    if (!session?.user?.email) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const user: string = session.user.email;

    try {
        const gameData = new GameData();
        const consensi = new Consensi();
        const allConsensuses = await consensi.getAllConsensiSortedByConsensusNum();

        const consensiList = [];
        for (const consensusData of allConsensuses) {
            try {
                const allSubmissions = await gameData.getByConsensusId(consensusData._id.toString());

                if (allSubmissions.length === 0) continue; // skip empty consensuses

                // Initialize scores
                const consensusValues: Record<string, number> = {};
                const validOptions = new Set(Object.keys(consensusData.options));
                validOptions.forEach((option) => {
                    consensusValues[option] = 0;
                });

                // Aggregate scores
                allSubmissions.forEach((submission) => {
                    Object.entries(submission.submission).forEach(([option, rank]) => {
                        if (validOptions.has(option)) {
                            const scoreMap = {
                                1: 4,
                                2: 3,
                                3: 2,
                                4: 1
                            };
                            consensusValues[option] += scoreMap[rank as keyof typeof scoreMap] || 0;
                        }
                    });
                });

                // Sort results: first by score (descending), then by option lexicographically
                const sortedEntries = Object.entries(consensusValues)
                    .sort(([aKey, aVal], [bKey, bVal]) => {
                        // Tiebreaker: first by score, then lexicographically
                        if (bVal !== aVal) return bVal - aVal;
                        return aKey > bKey ? 1 : -1; // Lexicographic comparison
                    })
                    .map(([option, points]) => ({
                        option,
                        points,
                        color: consensusData.options[option],
                    }));

                // Find user submission
                const userSubmission = allSubmissions.find((sub) => sub.metadata.user === user);

                // Add consensus data to response list
                consensiList.push({
                    consensusNum: consensusData.consensusNum,
                    date: consensusData.metadata.date,
                    category: consensusData.category,
                    options: consensusData.options,
                    submission: userSubmission?.submission || {},
                    overall: sortedEntries,
                    numSubmissions: allSubmissions.length,
                });

            } catch (error) {
                console.error(`Error processing consensus ${consensusData._id}:`, error);
                continue; // Skip any consensus that throws an error
            }
        }

        // Filter out any empty consensuses
        const resolvedConsensiList = consensiList.filter(Boolean);

        if (resolvedConsensiList.length === 0) {
            return NextResponse.json({ error: "No consensuses found with submissions." }, { status: 404 });
        }

        return NextResponse.json(resolvedConsensiList);
    } catch (error) {
        console.error("Error getting Consensi List:", error);
        return NextResponse.json({ error: "Error getting Consensi List" }, { status: 500 });
    }
}
