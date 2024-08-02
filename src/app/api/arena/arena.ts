import { NextRequest } from "next/server";

export const getPickedModels = async (req: NextRequest): Promise<string> => {
  const endpoint = `${process.env.SERVER_URL}/battle/init`;
  const accessToken = req.cookies.get("access_token");
  const res = await fetch(endpoint, {
    method: "POST",
    cache: "no-cache",
    headers: { 
      Cookie: `access_token=${accessToken?.value};`,
      "x-api-key": process.env.SERVER_API_KEY!
    }
  });
  const result = await res.json();
  const battleId = result.battle_id;
  if (!res.ok) {
    throw new Error("Failed to pick models.");
  }
  return battleId;
}

export const chatWithModel = async (req: NextRequest): Promise<string> => {
  const { modelName, prompt, battleId } = await req.json();
  const endpoint = `${process.env.SERVER_URL}/battle/inference`;
  const accessToken = req.cookies.get("access_token")?.value;
  const params = {
    method: "POST",
    body: JSON.stringify({
      battle_id: battleId,
      model: modelName,
      user_prompt: prompt,
    }),
    headers: { 
      "Content-type": "application/json;",
      Cookie: `access_token=${accessToken};`,
      "x-api-key": process.env.SERVER_API_KEY!
    }
  }
  const slicedPrompt = prompt.length > 100 ? prompt.slice(0, 97) + `... (${prompt.length})` : prompt;
  const res = await fetch(endpoint, params);
  const result = await res.json();
  if (!res.ok) {
    throw new Error(`Fetch failed. model ${modelName}, prompt: ${slicedPrompt}, battleId: ${battleId}\n${result.detail? `Error: ${result.detail}` : ""}`);
  }
  if (!result.response || result.response === "") {
    throw new Error(`Response is empty. model ${modelName}, prompt: ${slicedPrompt}, battleId: ${battleId}`);
  }
  return result.response;
}

export const chatResult = async (req: NextRequest): Promise<string[]> => {
  const { 
    battleId,
    choice,  
  } = await req.json();
  const endpoint = `${process.env.SERVER_URL}/battle/choice`;
  const accessToken = req.cookies.get("access_token")?.value;
  const body = {
    choice,
    battle_id: battleId,
  }
  const params = {
    method: "POST",
    body: JSON.stringify(body),
    headers: { 
      "Content-type": "application/json;",
      Cookie: `access_token=${accessToken};`,
      "x-api-key": process.env.SERVER_API_KEY!
    }
  }
  const res = await fetch(endpoint, params);
  const models = await res.json();
  return models;
}

export const chatReward = async (req: NextRequest) => {
  const { battleId } = await req.json();
  const accessToken = req.cookies.get("access_token")?.value;
  const endpoint = `${process.env.SERVER_URL}/battle/evaluate`;
  const params = {
    method: "POST",
    body: JSON.stringify({ battle_id: battleId }),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
      Cookie: `access_token=${accessToken};`,
      "x-api-key": process.env.SERVER_API_KEY!
    }
  }
  const res = await fetch(endpoint, params);
  const { score, reward, reason, tx_hash } = await res.json();
  return { score, reward, reason, tx_hash };
}

export const getDailyRewardPercentage = async () => {
  const endpoint = `${process.env.SERVER_URL}/battle/reward`;
  const res = await fetch(endpoint, {cache: "no-cache"});
  const { date, percentage } = await res.json();
  return { date, percentage }
}
