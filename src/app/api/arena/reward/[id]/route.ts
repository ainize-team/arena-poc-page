import { chatReward } from "@/app/api/arena/arena";
import { NextRequest } from "next/server";
import { ZERO_REWARD_MSG } from "@/constant/constant";

export async function GET(
  req: NextRequest, 
  { params }: { params: { id: string } }) {
  const battleId = params.id;
  try {
    const result = await chatReward(battleId, req);
    return Response.json(result, {
      status: 200,
    });
  } catch (error) {
    const errRes = {
      reward: 0,
      score: 0,
      reason: "Something fault. Please retry the chat.",
      tx_hash: ZERO_REWARD_MSG,
    };
    return Response.json(errRes, {
      status: 500,
    });
  }
}
