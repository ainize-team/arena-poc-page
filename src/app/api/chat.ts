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

const getPickedModels = async (): Promise<string[]> => {
  // TODO(yoojin): implement after connect api
  console.log('in getPickedModels');
  return ['gpt4', 'Yi'];
}

const chat = async ({ path, params }: RequestType): Promise<string> => {
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

export {
  chat,
  getPickedModels,
};
