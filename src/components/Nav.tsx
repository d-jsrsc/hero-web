import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { Link, useNavigate } from "react-router-dom";
import {
  Button,
  ButtonGroup,
  Container,
  Dropdown,
  DropdownButton,
  Form,
  Nav,
  Navbar,
} from "react-bootstrap";
import { useWallet } from "@solana/wallet-adapter-react";
import { useMemo } from "react";
import { useContractConfig } from "../contract";

export function NavHeader() {
  const { wallet, publicKey, connect, connecting, connected } = useWallet();
  const { setVisible } = useWalletModal();
  const { network, setNetwork } = useContractConfig();

  let navigate = useNavigate();

  const sortPubkey = useMemo(() => {
    if (!publicKey) return "";
    const base58 = publicKey.toBase58();
    return base58.slice(0, 4) + ".." + base58.slice(-4);
  }, [publicKey]);

  return (
    <Navbar collapseOnSelect expand="lg" bg="light">
      <Container>
        <Navbar.Brand href="#home">Helloworld</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">
              Market
            </Nav.Link>
          </Nav>
          {/* <Nav>
            {(connected && (
              <Nav.Link as={Link} to="/selfcenter">
                {sortPubkey}
              </Nav.Link>
            )) || (
              <WalletMultiButton
                style={{
                  width: "150px",
                }}
              ></WalletMultiButton>
            )}
            <Form.Select
              aria-label="Select Network"
              value={network}
              onChange={(e) => {
                setNetwork(e.target.value);
              }}
            >
              <option value={WalletAdapterNetwork.Mainnet}>
                {WalletAdapterNetwork.Mainnet}
              </option>
              <option value={WalletAdapterNetwork.Testnet}>
                {WalletAdapterNetwork.Testnet}
              </option>
              <option value={WalletAdapterNetwork.Devnet}>
                {WalletAdapterNetwork.Devnet}
              </option>
            </Form.Select>
          </Nav> */}
          <Nav>
            <ButtonGroup>
              {(connected && (
                <Nav.Link
                  as={Button}
                  onClick={() => {
                    navigate("/selfcenter");
                  }}
                  variant="outline-dark"
                >
                  {sortPubkey}
                </Nav.Link>
              )) || (
                <Button onClick={() => setVisible(true)} variant="outline-dark">
                  ConnectWallet
                </Button>
              )}

              <DropdownButton
                as={ButtonGroup}
                align="end"
                variant="outline-dark"
                menuVariant="dark"
                title={network}
              >
                <Dropdown.Item
                  active={network === WalletAdapterNetwork.Mainnet}
                  onClick={() => setNetwork(WalletAdapterNetwork.Mainnet)}
                >
                  {WalletAdapterNetwork.Mainnet}
                </Dropdown.Item>
                <Dropdown.Item
                  active={network === WalletAdapterNetwork.Testnet}
                  onClick={() => setNetwork(WalletAdapterNetwork.Testnet)}
                >
                  {WalletAdapterNetwork.Testnet}
                </Dropdown.Item>
                <Dropdown.Item
                  active={network === WalletAdapterNetwork.Devnet}
                  onClick={() => setNetwork(WalletAdapterNetwork.Devnet)}
                >
                  {WalletAdapterNetwork.Devnet}
                </Dropdown.Item>
              </DropdownButton>
            </ButtonGroup>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
