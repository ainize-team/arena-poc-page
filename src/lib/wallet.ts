import { atom, useSetRecoilState, AtomEffect } from "recoil";
import { recoilPersist } from "recoil-persist";

const { persistAtom } = recoilPersist();

export const connectWallet = async (): Promise<{
  address: string,
  chainId: number,
} | undefined> => {
  const walletExtension = window.ainetwork;
  const { chainId } = await window.ainetwork.getNetwork();
  try {
    if (walletExtension) {
      await walletExtension.signMessage("test");
      const address = await walletExtension.getAddress();
      return {address, chainId};
    } else {
      return;
    }
  } catch (err: any) {
    // NOTE(yoojin): If user deny the wallet sign, It throw sign error.
    return { address: "", chainId };
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
