export enum ArenaStatus {
  READY = 'READY',
  COMPETING = 'COMPETING',
  END = 'END',
}


export type ModelResponse = {
  role: "user" | "assistant",
  content: string,
}

export type ChoiceReqBody = {
  userAddress: string,
  choice: "model_a" | "model_b" | "tie" | "bad",
  modelA: string,
  modelB: string,
  turn: number,
  modelAResponse: ModelResponse[],
  modelBResponse: ModelResponse[],
}