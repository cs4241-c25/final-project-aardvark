import { Consensi, GameData } from "@/lib/datalayer";
import { getServerSession } from "next-auth";

export async function GET(request: Request) {
    const session = await getServerSession();

    if (!session || !session.user?.email) {
        return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userEmail = session.user.email;
    const consensiDataLayer = new Consensi();
    const gameDataLayer = new GameData();

    try {
        // gather all consensi
        const consensi = await consensiDataLayer.getAllConsensiSortedByDate();

        // get the specific user submissions
        const userSubmissions = await gameDataLayer.getByUsername(userEmail);

        // merging both data together
        const mergedData = consensi.map(consensus => {
            const submission = userSubmissions.find(sub => sub.consensusId === consensus._id.toString());

            return {
                ...consensus,
                userSubmission: submission ? submission.submission : null,
            };
        });

        return Response.json({ consensi: mergedData });
    } catch (error: any) {
        return Response.json({ error: error.message }, { status: 500 });
    }
}