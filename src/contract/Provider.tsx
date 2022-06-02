import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { AccountInfo, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";

import { Contract } from "./Instance";
import { heroTokens as tokens } from "./tokenState";
import log from "loglevel";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { useRecoilState } from "recoil";

const logger = log.getLogger("ContractProvider");
const instance = Contract.getInstance();

export interface ContextData {
  contract: { instance: Contract };
  accountInfo: AccountInfo<Buffer> | null;
  network: WalletAdapterNetwork;
  setNetwork: (arg0: WalletAdapterNetwork) => void;
  loadHerosData: (contract: Contract, publicKey: PublicKey) => void;
}

// export const contextDefaultValue: ContextData = {
//   instance,
//   accountInfo: null,
// };
export const ContractContext = createContext<ContextData | null>(null);

// export const useContract = () => useContext(ContractContext);

type Props = {
  children: React.ReactNode;
  network: WalletAdapterNetwork;
  setNetwork: (arg0: WalletAdapterNetwork) => void;
};

export const Provider = ({ children, network, setNetwork }: Props) => {
  const { connection } = useConnection();
  const { publicKey } = useWallet();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_heroTokens, setHeroTokens] = useRecoilState(tokens);

  const [accountInfo, setAccountInfo] = useState<AccountInfo<Buffer> | null>(
    null
  );

  const contract = useMemo(() => {
    instance.setConnection(connection);
    if (publicKey) {
      loadHerosData(instance, publicKey);
    }
    return { instance };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connection, publicKey]);

  useEffect(() => {
    if (!publicKey) return;
    connection
      .getAccountInfo(publicKey)
      .then((data) => {
        setAccountInfo(data);
      })
      .catch(console.error);

    const id = connection.onAccountChange(publicKey, (info) => {
      setAccountInfo(info);
    });
  }, [connection, publicKey]);

  function loadHerosData(contract: Contract, publicKey: PublicKey) {
    contract.getHeros(publicKey).then((data) => setHeroTokens(data));
    // contract
    //   .getHistory(publicKey)
    //   .then((historyTrans) => console.log(historyTrans));
  }

  return (
    <ContractContext.Provider
      value={{ contract, accountInfo, setNetwork, network, loadHerosData }}
    >
      {children}
    </ContractContext.Provider>
  );
};

export function useContractConfig() {
  const context = useContext(ContractContext);
  if (!context) {
    throw new Error("Missing connection context");
  }
  return {
    network: context.network,
    setNetwork: context.setNetwork,
    contract: context.contract,
    accountInfo: context.accountInfo,
    loadHerosData: context.loadHerosData,
  };
}
