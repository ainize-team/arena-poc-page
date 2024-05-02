type RequestType = {
  path: string,
  params?: any,
}

const mockedChatAPI = async (prompt: string) => {
  const response = new Promise<string>(
    (resolve) => {
      return setTimeout(() => resolve(`You said '${prompt}'.`), 500)
    }
  )
  return response;
}

export const getPickedModels = async (): Promise<string[]> => {
  const endpoint = `${process.env.NEXT_PUBLIC_SERVER_URL}/battle/init`;
  const res = await fetch(endpoint, {cache: 'no-cache'});
  const models = await res.json();
  return models;
}

export const chatWithModel = async (modelName: string, prompt: string, systemPrompt?: string): Promise<string> => {
  const endpoint = `${process.env.NEXT_PUBLIC_SERVER_URL}/battle/inference`;
  const params = {
    method: 'POST',
    body: JSON.stringify({
      model_name: modelName,
      user_prompt: prompt,
      system_prompt: systemPrompt,
    }),
    headers: {
      'Content-type': "application/json; charset=UTF-8"
    }
  }
  try {
    const res = await fetch(endpoint, params);
    const result = await res.json();
    return result.response;
  } catch (err: any) {
    console.log('err :>> ', err);
    return "err";
  }
}

export const chat = async ({ path, params }: RequestType): Promise<string> => {
  console.log('path, params :>> ', path, params);
  const {prompt} = params;
  if (!prompt) {
    return '';
  }
  let response: string;
  if (path === '/mock') {
    console.log('mock');
    response = await mockedChatAPI(prompt);
  } else {
    response = path; // FIXME(yoojin): temp
  }
  return response;
}