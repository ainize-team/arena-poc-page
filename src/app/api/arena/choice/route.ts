import { choiceModel } from "@/app/api/arena/arena";
import { NextRequest } from "next/server";

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