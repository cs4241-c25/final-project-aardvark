import { Suggestion } from "@/lib/datalayer";
import { ObjectId } from "mongodb";
import {ConsensiSuggestion} from "@/lib/interfaces";

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

export async function POST(request: Request) {
    const consensiDataLayer = new Suggestion();
    const suggestion: ConsensiSuggestion = await request.json()
    console.log("Suggestions: ", suggestion);

    try{
        await consensiDataLayer.addNewSuggestion(suggestion)
        return Response.json({ message: "Suggestion received successfully!" }, { status: 200 });
    } catch(error:any){
        return Response.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    console.log("id: ", id);

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
