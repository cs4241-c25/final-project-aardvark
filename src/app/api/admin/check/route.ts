import { getServerSession } from "next-auth";

export async function GET() {
  const session = await getServerSession();

  if (
    !session ||
    session.user?.image === "anonymous" ||
    (session.user?.email !== process.env.ARI_ADMIN &&
      session.user?.email !== process.env.JACK_ADMIN &&
      session.user?.email !== process.env.GUS_ADMIN &&
      session.user?.email !== process.env.WALDEN_ADMIN &&
      session.user?.email !== process.env.STEVE_ADMIN &&
      session.user?.email !== process.env.BMO_ADMIN)
  ) {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  } else {
    return Response.json({ message: "Authorized" });
  }
}
