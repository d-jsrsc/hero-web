import { PublicKey } from "@solana/web3.js";

export type NFTDataItem = { address: PublicKey; mint: string };

export type HeroNode = {
  mint: string;
  pda: string;
  children: (HeroNode | null)[];
  root: null | {
    name: string;
    owner: string;
  };
};

export type HeroTokens = {
  metadataData: {
    name: string;
    symbol: string;
    mint: PublicKey;
  };
  token: {
    address: PublicKey;
    info: {
      mint: string;
      owner: string;
      tokenAmount: {
        uiAmount: number;
        uiAmountString: string;
      };
    };
  };
};
