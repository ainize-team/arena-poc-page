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
  MYPAGE = "mypage",
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

export type Chat = {
  text: string,
  type: "user" | "assistant",
}

export enum CaptchaStatus {
  YET = "YET",
  TRUE = "TRUE",
  FALSE = "FALSE"
}

export type UserInfo = {
  address: string | null,
  credit: number,
  display_name: string,
  first_name: string,
  last_name: string,
  picture: string,
  tier: number,
  exp: number,
}
