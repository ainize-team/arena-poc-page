import { chatReward } from "@/app/api/arena/arena";
import { NextRequest } from "next/server";
import { ZERO_REWARD_MSG } from "@/constant/constant";

export async function GET(
  req: NextRequest, 
  { params }: { params: { id: string } }) {
  const battleId = params.id;
  try {
    const result = await chatReward(battleId);
    console.log('result :>> ', result);
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
    console.log('errRes :>> ', errRes);
    return Response.json(errRes, {
      status: 500,
    });
  }
}
