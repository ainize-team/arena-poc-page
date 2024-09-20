import { NextRequest } from "next/server";
import { chatWithModel } from "../arena";

const FAILED_INFERENCE_MSG =
  "An error occurred during inference. Please refresh this page and try again.";

/**
 * Battle Id 로 Backend에서 할당된 Model에 Inference 요청
 * url: /api/arena/chat
 * req: battleId(string), model: model_a | model_b
 * res: Result of inference(string).
 */

export async function POST(req: NextRequest) {
  try {
    const result = await chatWithModel(req);
    return Response.json(result, {
      status: 200,
    });
  } catch (error) {
    console.error(`${req.url}> ${error}`);
    return Response.json(FAILED_INFERENCE_MSG, {
      status: 500,
    });
  }
}
