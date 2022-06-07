const mintsJson = require("../contract/mints.json");

export { Provider, useContractConfig } from "./Provider";
export type { NFTDataItem, HeroNode } from "./types";

export { Contract } from "./Instance";

export const mints = Object.keys(mintsJson);
export const mintsObject: Record<
  string,
  {
    "name": string;
    "decimals": number;
  }
> = mintsJson;
