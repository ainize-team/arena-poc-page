"use server";

import { ChoiceReqBody } from "@/types/types";

export const getPickedModels = async (): Promise<string[]> => {
  const endpoint = `${process.env.SERVER_URL}/battle/init`;
  const res = await fetch(endpoint, {cache: "no-cache"});
  const models = await res.json();
  return models;
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
  try {
    const res = await fetch(endpoint, params);
  const result = await res.json();
    return result.response;
  } catch (err: any) {
    console.log("err :>> ", err);
    return "err";
  }
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
    console.log("err :>> ", err);
    return "err";
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
    return { score, reward, reason, tx_hash };
  } catch (err: any) {
    console.log("err :>>", err);
    return "err"
  }
}
