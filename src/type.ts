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
