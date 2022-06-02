import { useWallet } from "@solana/wallet-adapter-react";
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useRecoilState } from "recoil";

import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";

import log from "loglevel";
import { useContractConfig } from "../contract";
// import { HeroTokens } from "../contract/types";
import { Contract } from "../contract/Instance";
import { heroTokens as tokens } from "../contract/tokenState";

const mints = require("../contract/mints.json");

const logger = log.getLogger("Market");

export default function Market() {
  const wallet = useWallet();
  const [heroTokens] = useRecoilState(tokens);
  const [userMarkets, setUserMarkets] = useState<any[]>([]);

  const {
    contract,
    accountInfo,
    loadHerosData: ReloadHeroData,
  } = useContractConfig();
  const { connected, disconnect, publicKey } = wallet;

  useEffect(() => {
    if (!publicKey) return;
    contract.instance.getHeroTrans(publicKey).then((data) => {
      console.log("user markets", data);
      setUserMarkets(data);
    });
  }, [contract, publicKey]);

  const getHero = useCallback(async () => {
    if (!wallet.publicKey) return;
    await contract.instance.getHeroMetadata(
      wallet,
      "Qg8dmgAtz8mvtCYb2jvXhaGiwmad21ZTfzvUSUoxC3t",
      10
    );
    ReloadHeroData(contract.instance, wallet.publicKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contract, wallet]);

  const createTrans = useCallback(async () => {
    if (
      wallet.publicKey?.toString() !==
      "3112ASdPyfQFAvoyatxRdUrhe6MwN3TrWzxiBia6UdqA"
    )
      return;
    const depositMint = new PublicKey(
      "Qg8dmgAtz8mvtCYb2jvXhaGiwmad21ZTfzvUSUoxC3t"
    ); // ruby
    const receiveMint = new PublicKey(
      "7MEBQqH8Bh6SGixf2m17MQ3k82QCy5rDuiz2KyhhMR57"
    ); // sapphire
    await contract.instance.createHeroTrans(wallet, depositMint, receiveMint);
  }, [contract, wallet]);

  const cancelTrans = useCallback(
    async (marketAccount: PublicKey) => {
      await contract.instance.cancelHeroTrans(wallet, marketAccount);
    },
    [contract, wallet]
  );

  const exchangeTrans = useCallback(async () => {
    const marketAccount = new PublicKey(
      "58kAgqMCemBfDxu5tb4RnkHZdCiHQdtteThXReciFoGA"
    );
    await contract.instance.exchangeHeroTrans(wallet, marketAccount);
  }, [contract, wallet]);

  if (!connected) {
    return <div>connect wallet first</div>;
  }

  return (
    <div>
      {heroTokens.map((item) => {
        const { name, decimals } = mints[item.token.info.mint]!;
        return (
          <div key={item.token.address.toString()}>
            <div>name: {name}</div>
            <div>
              amount: {item.token.info.tokenAmount.uiAmount.toFixed(decimals)}
            </div>
          </div>
        );
      })}
      <button onClick={createTrans}>createTrans</button>
      <button onClick={exchangeTrans}>exchangeTrans</button>
      <button onClick={getHero}>getHero</button>
      <button
        onClick={() => {
          disconnect().catch(() => {});
        }}
      >
        disconnect
      </button>
      {(accountInfo?.lamports || 0) / LAMPORTS_PER_SOL}
      <div>
        <h3>markets</h3>
        {userMarkets.map((item) => {
          return (
            <div key={item.account.toString()}>
              {item.account.toString()}
              <button onClick={() => cancelTrans(item.account)}>
                cancelTrans
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
