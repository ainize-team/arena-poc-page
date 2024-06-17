import { NextRequest } from "next/server";

export async function GET(
  req: NextRequest, 
  { params }: { params: { address: string } }
) {
  const { address } = params;
  try {
    if (!address) throw new Error("no address");
    const endpoint = `${process.env.SERVER_URL}/event/user/${address}/reward`;
    await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      },
      cache: "no-cache",
    });
    return Response.json("", {
      status: 200,
    });
  } catch (error) {
    return Response.json("", {
      status: 500,
    });
  }
}