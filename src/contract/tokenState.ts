import {
  RecoilRoot,
  atom,
  selector,
  useRecoilState,
  useRecoilValue,
} from "recoil";
import { HeroTokens } from "./types";

export const heroTokens = atom<HeroTokens[]>({
  key: "heroTokens", // unique ID (with respect to other atoms/selectors)
  default: [], // default value (aka initial value)
});

// const [heroTokens, setHeroTokens] = useState<HeroTokens[]>([]);
