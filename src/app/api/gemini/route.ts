import {Gemini} from "@/lib/gemini";
import {getServerSession} from "next-auth";

export async function POST(req: Request, res: Response) {

    const session = await getServerSession();

    if (!session) {
        return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const gemini = new Gemini()
    const prompt = await req.text()

    const response = await gemini.prompt(prompt)

    const jsonResponse = response.replace(/```json|```/g, "").trim();


    return Response.json(jsonResponse)
}

