export enum ArenaStatus {
  NOTCONNECTED = 'NOTCONNECTED',
  READY = "READY",
  INFERENCING = "INFERENCING",
  COMPETING = "COMPETING",
  REGISTERING = 'REGISTERING',
  END = "END",
}

export enum ArenaMenuKey {
  ARENA = "arena",
  LEADERBOARD = "leaderboard",
}

export enum ChoiceType {
  MODELA = "model_a",
  MODELB = "model_b",
  TIE = "tie",
  NOTHING = "bad",
}

export enum APIStatus {
  OK = 200,
  FAILED = 500,
}

type ModelResponse = {
  role: "user" | "assistant",
  content: string,
}

export type ChatResultReqBody = {
  userAddress: string,
  choice: "model_a" | "model_b" | "tie" | "bad",
  modelA: string,
  modelB: string,
  turn: number,
  modelAResponse: ModelResponse[],
  modelBResponse: ModelResponse[],
}

export type LeaderboardTableData = {
  key: number,
  rank: string,
  ci: string,
  elo: string,
  modelName: string,
  link: string,
  votes: number,
  org: string,
  license: string,
}
