import { chatEvaluate } from "@/app/api/arena/arena";
import { NextRequest } from "next/server";

/**
 * Choice 까지 완료된 Battle 의 점수 산정 및 크레딧 증가
 * url: /api/arena/reward
 * req: battleId(string)
 * res: Reward amount(number).
 */

export async function POST(
  req: NextRequest, 
) {
  try {
    const result = await chatEvaluate(req);
    return Response.json(result, {
      status: 200,
    });
  } catch (error) {
    const errRes = {
      reward: 0,
    };
    return Response.json(errRes, {
      status: 500,
    });
  }
}
