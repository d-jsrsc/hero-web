import { useWallet } from "@solana/wallet-adapter-react";
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import log from "loglevel";
import { useContractConfig } from "../contract";
import { HeroTokens } from "../contract/types";
const mints = require("../contract/mints.json");

const logger = log.getLogger("Market");

export default function Market() {
  const wallet = useWallet();
  const { contract } = useContractConfig();
  const [heroTokens, setHeroTokens] = useState<HeroTokens[]>([]);
  const { publicKey } = wallet;

  useEffect(() => {
    if (!publicKey) return;
    contract.instance.getHeros(publicKey).then((data) => setHeroTokens(data));
  }, [contract, publicKey]);

  const getHero = useCallback(async () => {
    await contract.instance.getHeroMetadata(
      wallet,
      "6ekMJYUBfid5oFzoSXTbGiKy5y8GVqaZaU5Db8DXdUgQ",
      10
    );
    logger.debug("getHero success");
  }, [contract, wallet]);

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
      <button onClick={getHero}>getHero</button>
    </div>
  );
}
