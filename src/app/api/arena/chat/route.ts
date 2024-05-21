import { chatWithModel } from "@/app/api/arena/arena";
import { NextRequest } from "next/server";

const FAILED_INFERENCE_MSG = "Inference failed. Please select the opposite model.";

export async function POST(req: NextRequest) {
  const { modelName, prompt, systemPrompt } = await req.json();
  try {
    const result = await chatWithModel(modelName, prompt, systemPrompt);
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