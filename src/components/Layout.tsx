import { Outlet } from "react-router-dom";
import { Container } from "react-bootstrap";

import { NavHeader } from "./Nav";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";

export default function Layout() {
  return (
    <>
      <NavHeader />

      <Container>
        <Outlet />
      </Container>
    </>
  );
}
