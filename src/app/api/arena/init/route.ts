import { battleInit } from "@/src/app/api/arena/arena";
import { NextRequest } from "next/server";

/**
 * Backend 에 battle id 생성
 * url: /api/arena/init
 * res: battle_id(string).
 */

export async function POST(req: NextRequest) {
  try {
    const battleId = await battleInit(req);
    return Response.json(battleId, {
      status: 200,
    });
  } catch (error) {
    console.log(error);
    return Response.json("", {
      status: 500,
    });
  }
}
