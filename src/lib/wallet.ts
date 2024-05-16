import { Signer } from "@ainblockchain/ain-js/lib/signer/signer";
import { atom } from "recoil";

export const requestAddress = async () => {
  const walletExtension: Signer = window.ainetwork;
  if (walletExtension) {
    const address = await walletExtension.getAddress();
    return address
  }
};

export const addressAtom = atom({
  key: "address",
  default: "",
})
