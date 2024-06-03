import { chatReward } from "@/app/api/arena/arena";
import { NextRequest } from "next/server";

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
      reason: "",
      tx_hash: "Something fault. Please retry the chat.",
    };
    console.log('errRes :>> ', errRes);
    return Response.json(errRes, {
      status: 500,
    });
  }
}
