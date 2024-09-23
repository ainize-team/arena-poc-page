import { NextRequest } from "next/server";
import { chatEvaluate } from "@/src/app/api/arena/arena";
import { getDailyRewardPercentage } from "@/src/app/api/arena/arena";

/**
 * Choice 까지 완료된 Battle 의 점수 산정 및 크레딧 증가
 * url: /api/arena/reward
 * req: battleId(string)
 * res: Reward amount(number).
 */

export async function POST(req: NextRequest) {
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

export async function GET() {
  try {
    const result = await getDailyRewardPercentage();
    // console.log("result :>> ", result);
    return Response.json(result.percentage, {
      status: 200,
    });
  } catch (error) {
    return Response.json(0, {
      status: 500,
    });
  }
}
