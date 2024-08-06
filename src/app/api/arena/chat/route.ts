import { chatWithModel } from "@/app/api/arena/arena";
import { NextRequest } from "next/server";

const FAILED_INFERENCE_MSG = "An error occurred during inference. Please refresh this page and try again.";

export async function POST(req: NextRequest) {
  try {
    const result = await chatWithModel(req);
    return Response.json(result, {
      status: 200,
    })
  } catch (error) {
    console.error(`${req.url}> ${error}`);
    return Response.json(FAILED_INFERENCE_MSG, {
      status: 500,
    })
  }
}