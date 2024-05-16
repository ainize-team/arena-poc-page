import { Signer } from "@ainblockchain/ain-js/lib/signer/signer";
import { atom, useSetRecoilState, AtomEffect } from "recoil";
import { recoilPersist } from "recoil-persist";

const { persistAtom } = recoilPersist();

export const requestAddress = async () => {
  const walletExtension: Signer = window.ainetwork;
  if (walletExtension) {
    const address = await walletExtension.getAddress();
    return address
  }
};

const ssrCompletedState = atom({
  key: "SsrCompleted",
  default: false,
})

export const useSsrCompletedState = () => {
  const setSsrCompleted = useSetRecoilState(ssrCompletedState)
  return () => setSsrCompleted(true);
}

export const persistAtomEffect = <T>(param: Parameters<AtomEffect<T>>[0]) => {
  param.getPromise(ssrCompletedState).then(() => persistAtom(param))
}

export const addressAtom = atom({
  key: "address",
  default: "",
  effects_UNSTABLE: [persistAtomEffect],
})
