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
    return Response.json("", {
      status: 500,
    });
  }
}
