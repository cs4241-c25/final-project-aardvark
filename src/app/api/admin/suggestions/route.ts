import { Suggestion } from "@/lib/datalayer";
import { ObjectId } from "mongodb";

export async function GET(request: Request) {
    const consensiDataLayer = new Suggestion();

    try {
        // Get all consensi from the database
        const consensi = await consensiDataLayer.getSuggestions();

        return Response.json({ consensi });
    } catch (error: any) {
        return Response.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
        return Response.json({ error: 'Missing id parameter' }, { status: 400 });
    }

    const consensiDataLayer = new Suggestion();

    try {
        const objectId = new ObjectId(id);
        const consensi = await consensiDataLayer.removeSelection(objectId);
        return Response.json({ consensi });
    } catch (error: any) {
        return Response.json({ error: error.message }, { status: 500 });
    }
}
