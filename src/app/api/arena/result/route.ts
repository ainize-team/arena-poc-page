import { chatResult } from "@/app/api/arena/arena";
import { ChatResultReqBody } from "@/types/type";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  
  const chatResultReqBody: ChatResultReqBody = await req.json();
  try {
    const result = await chatResult(req);
    return Response.json(result, {
      status: 200,
    });
  } catch (error) {
    return Response.json("", {
      status: 500,
    });
  }
}