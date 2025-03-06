import { Consensi } from "@/lib/datalayer";

export async function GET(request: Request) {
    const consensiDataLayer = new Consensi();

    try {
        // Get all consensi from the database
        const consensi = await consensiDataLayer.getAllConsensiSortedByDateAfterToday();
        return Response.json({ consensi });
    } catch (error: any) {
        return Response.json({ error: error.message }, { status: 500 });
    }
}
