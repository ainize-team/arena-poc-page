import { Signer } from "@ainblockchain/ain-js/lib/signer/signer";


export const requestAddress = async () => {
  const walletExtension:Signer = window.ainetwork;

  if (walletExtension) {
    const address = await walletExtension.getAddress();
    return address
  }
};
