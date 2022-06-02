import { useMemo, useState } from "react";
import {
  Metaplex,
  keypairIdentity,
  bundlrStorage,
} from "@metaplex-foundation/js-next";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import {
  ConnectionProvider,
  useConnection,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";

import {
  LedgerWalletAdapter,
  PhantomWalletAdapter,
  SlopeWalletAdapter,
  SolflareWalletAdapter,
  SolletExtensionWalletAdapter,
  SolletWalletAdapter,
  TorusWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import { clusterApiUrl } from "@solana/web3.js";
import { Routes, Route, useLocation } from "react-router-dom";
import {
  RecoilRoot,
  atom,
  selector,
  useRecoilState,
  useRecoilValue,
} from "recoil";

import { Provider as ContractProvider } from "./contract";
import { isProd } from "./utils";

import Layout from "./components/Layout";
import Heros from "./pages/Heros";
import { HerosView, HerosModal } from "./pages/HerosView";
import Market from "./pages/Market";
import NoMatch from "./pages/NoMatch";
import SelfCenter from "./pages/SelfCenter";

function AppRoute() {
  let location = useLocation();
  let state = location.state as { backgroundLocation?: Location };

  return (
    <>
      <Routes location={state?.backgroundLocation || location}>
        <Route path="/" element={<Layout />}>
          <Route index element={<Market />} />
          <Route path="/heros" element={<Heros />} />
          <Route path="/heros/:rootkey" element={<HerosView />} />
          <Route path="/selfcenter" element={<SelfCenter />} />
          <Route path="*" element={<NoMatch />} />
        </Route>
      </Routes>

      {/* Show the modal when a `backgroundLocation` is set */}
      {state?.backgroundLocation && (
        <Routes>
          <Route path="/heros/:rootkey" element={<HerosModal />} />
        </Routes>
      )}
    </>
  );
}

const App = () => {
  console.log({ isProd });
  const [network, setNetwork] = useState(
    isProd ? WalletAdapterNetwork.Mainnet : WalletAdapterNetwork.Devnet
  );

  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SlopeWalletAdapter(),
      new SolflareWalletAdapter({ network }),
      new TorusWalletAdapter(),
      new LedgerWalletAdapter(),
      new SolletWalletAdapter({ network }),
      new SolletExtensionWalletAdapter({ network }),
    ],
    [network]
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider autoConnect wallets={wallets}>
        <WalletModalProvider>
          <RecoilRoot>
            <ContractProvider {...{ network, setNetwork }}>
              <AppRoute />
            </ContractProvider>
          </RecoilRoot>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

export default App;
