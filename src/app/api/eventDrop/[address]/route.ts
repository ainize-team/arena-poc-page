import { NextRequest } from "next/server";

export async function GET(
  req: NextRequest, 
  { params }: { params: { address: string } }
) {
  const { address } = params;
  try {
    if (!address) throw new Error("no address");
    console.log(`Event Check (${address})`);
    const endpoint = `${process.env.SERVER_URL}/eventDrop/${address}`;
    await fetch(endpoint);
    return Response.json("", {
      status: 200,
    });
  } catch (error) {
    return Response.json("", {
      status: 500,
    });
  }
}