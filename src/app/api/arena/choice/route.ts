import { choiceModel } from "@/app/api/arena/arena";
import { NextRequest } from "next/server";

/**
 * Battle 의 승자를 정하는 요청
 * url: /api/arena/choice
 * req: battleId(string), choice: model_a | model_b | tie | bad
 * res: models of choiced battle({model_a: string, model_b: string}).
 */

export async function POST(req: NextRequest) {
  try {
    const result = await choiceModel(req);
    return Response.json(result, {
      status: 200,
    });
  } catch (error) {
    return Response.json("", {
      status: 500,
    });
  }
}