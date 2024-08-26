import { Session } from "next-auth";
import { atom, useSetRecoilState, AtomEffect } from "recoil";
import { recoilPersist } from "recoil-persist";

const localStorage =
  typeof window !== "undefined" ? window.localStorage : undefined;

const { persistAtom } = recoilPersist({
  key: "recoil-states",
  storage: localStorage,
});
const ssrCompletedState = atom({
  key: "SsrCompleted",
  default: false,
});

export const useSsrCompletedState = () => {
  const setSsrCompleted = useSetRecoilState(ssrCompletedState);
  return () => setSsrCompleted(true);
};

export const persistAtomEffect = <T>(param: Parameters<AtomEffect<T>>[0]) => {
  param.getPromise(ssrCompletedState).then(() => persistAtom(param));
};

export const addressAtom = atom({
  key: "address",
  default: "",
  effects_UNSTABLE: [persistAtomEffect],
});

export const userInfoState = atom<Session | null>({
  key: "userInfo",
  default: null,
  effects_UNSTABLE: [persistAtom],
});
