import { battleInit } from "@/app/api/arena/arena";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const battleId = await battleInit(req);
    return Response.json(battleId, {
      status: 200,
    })
  } catch (error) {
    console.log(error)
    return Response.json("", {
      status: 500,
    });
  }
}