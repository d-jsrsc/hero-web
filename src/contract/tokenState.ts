import {
  RecoilRoot,
  atom,
  selector,
  useRecoilState,
  useRecoilValue,
} from "recoil";
import { HeroTokens } from "./types";

// export const myHeroMints = atom<string[]>({
//   key: "myHeroTokens", // unique ID (with respect to other atoms/selectors)
//   default: [],
// });
export const myHeroMints = selector({
  key: "myHeroMints",
  get: ({ get }) => {
    const myTokens = get(heroTokens);
    return myTokens.map((item) => item.token.info.mint);
  },
});
export const heroTokens = atom<HeroTokens[]>({
  key: "heroTokens", // unique ID (with respect to other atoms/selectors)
  default: [], // default value (aka initial value)
});

// const [heroTokens, setHeroTokens] = useState<HeroTokens[]>([]);
