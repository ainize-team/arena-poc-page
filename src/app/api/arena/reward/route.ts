import { chatReward } from "@/app/api/arena/arena";
import { NextRequest } from "next/server";

export async function POST(
  req: NextRequest, 
) {
  try {
    const result = await chatReward(req);
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
