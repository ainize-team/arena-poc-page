import { ChatResultReqBody } from "../../../type"

export const getPickedModels = async (): Promise<string[]> => {
  const endpoint = `${process.env.SERVER_URL}/battle/init`;
  const res = await fetch(endpoint, {cache: "no-cache"});
  if (!res.ok) {
    throw new Error("Failed to pick models.");
  }
  const models = await res.json();
  return models;
}

export const chatWithModel = async (
  modelName: string, 
  prompt: string, 
  systemPrompt?: string
): Promise<string> => {
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
 }: ChatResultReqBody) => {
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
  const res = await fetch(endpoint, params);
  const { battle_id } = await res.json();
  return battle_id;
}

export const chatReward = async (battleId: string) => {
  const endpoint = `${process.env.SERVER_URL}/battle/${battleId}/reward`;
  const params = {
    method: "POST",
    headers: {
      "Content-type": "application/json; charset=UTF-8"
    }
  }
  const res = await fetch(endpoint, params);
  const { score, reward, reason, tx_hash } = await res.json();
  return { score, reward, reason, tx_hash };
}

export const getDailyRewardPercentage = async () => {
  const endpoint = `${process.env.SERVER_URL}/battle/reward`;
  const res = await fetch(endpoint);
  const { date, percentage } = await res.json();
  return { date, percentage }
}
