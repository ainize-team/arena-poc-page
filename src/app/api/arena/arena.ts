"use server";
// FIXME(yoojin): move all functions to api route!
type ModelResponse = {
  role: "user" | "assistant",
  content: string,
}

type ChoiceReqBody = {
  userAddress: string,
  choice: "model_a" | "model_b" | "tie" | "bad",
  modelA: string,
  modelB: string,
  turn: number,
  modelAResponse: ModelResponse[],
  modelBResponse: ModelResponse[],
}

export const getPickedModels = async (): Promise<string[]> => {
  const endpoint = `${process.env.SERVER_URL}/battle/init`;
  try {
    const res = await fetch(endpoint, {cache: "no-cache"});
    const models = await res.json();
    return models;
  } catch (err) {
    console.log("Pick Models Error >", err);
    throw new Error("Failed to pick models.");
  }
}

export const chatWithModel = async (modelName: string, prompt: string, systemPrompt?: string): Promise<string> => {
  const endpoint = `${process.env.SERVER_URL}/battle/inference`;
  const params = {
    method: "POST",
    body: JSON.stringify({
      model_name: modelName,
      user_prompt: prompt,
      system_prompt: systemPrompt,
    }),
    headers: {
      "Content-type": "application/json; charset=UTF-8"
    }
  }
  const slicedPrompt = prompt.length > 100 ? prompt.slice(0, 97) + `... (${prompt.length})` : prompt;
  const res = await fetch(endpoint, params);
  const result = await res.json();
  if (!res.ok) {
    throw new Error(`Fetch failed. model ${modelName}, prompt: ${slicedPrompt}, systemPrompt: ${systemPrompt}\n${result.detail? `Error: ${result.detail}` : ""}`);
  }
  if (!result.response || result.response === "") {
    throw new Error(`Response is empty. model ${modelName}, prompt: ${slicedPrompt}, systemPrompt: ${systemPrompt}`);
  }
  return result.response;
}

export const chatResult = async ({ 
  userAddress,
  choice,
  modelA,
  modelB,
  turn,
  modelAResponse,
  modelBResponse,
 }: ChoiceReqBody) => {
  const endpoint = `${process.env.SERVER_URL}/battle/result`;
  const body = {
    user_address: userAddress,
    choice,
    model_a_name: modelA,
    model_b_name: modelB,
    turn,
    model_a_response: modelAResponse,
    model_b_response: modelBResponse,
  }
  const params = {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      "Content-type": "application/json; charset=UTF-8"
    }
  }
  try {
    const res = await fetch(endpoint, params);
    const { battle_id } = await res.json();
    return battle_id;
  } catch (err: any) {
    console.log("Get Result Error :>> ", err);
    throw new Error(`Failed to get battle result. ${JSON.stringify(body)}`);
  }
}

export const chatReward = async (battleId: string) => {
  const endpoint = `${process.env.SERVER_URL}/battle/${battleId}/reward`;
  const params = {
    method: "POST",
    headers: {
      "Content-type": "application/json; charset=UTF-8"
    }
  }

  try {
    const res = await fetch(endpoint, params);
    const { score, reward, reason, tx_hash } = await res.json();
    console.debug('reward data:>> ', score, reward, reason, tx_hash);
    return { score, reward, reason, tx_hash };
  } catch (err: any) {
    console.log("err :>>", err);
    return "err"
  }
}
