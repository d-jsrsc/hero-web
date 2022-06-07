import { useWallet } from "@solana/wallet-adapter-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { Dialog } from "@reach/dialog";
import { useRecoilState, useRecoilValue } from "recoil";

import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";

import log from "loglevel";
import { useContractConfig, mints, mintsObject } from "../../contract";
import { heroTokens as tokens, myHeroMints } from "../../contract/tokenState";
import {
  Button,
  Card,
  Col,
  Container,
  Form,
  Row,
  Tab,
  Tabs,
} from "react-bootstrap";

const logger = log.getLogger("Market");

export default function SelfCenter() {
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
    // await contract.instance.createHeroTrans(wallet, depositMint, receiveMint);
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
        const { name, decimals } = mintsObject[item.token.info.mint]!;
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

export function SelfCenterModal() {
  let navigate = useNavigate();
  let buttonRef = useRef<HTMLButtonElement>(null);

  const [key, setKey] = useState("source");

  const wallet = useWallet();
  // const [heroTokens] = useRecoilState(tokens);
  // const [userMarkets, setUserMarkets] = useState<any[]>([]);
  // const {
  //   contract,
  //   accountInfo,
  //   loadHerosData: ReloadHeroData,
  // } = useContractConfig();
  const { connected, disconnect, publicKey } = wallet;

  // useEffect(() => {
  //   if (!publicKey) return;
  //   contract.instance.getHeroTrans(publicKey).then((data) => {
  //     console.log("user markets", data);
  //     setUserMarkets(data);
  //   });
  // }, [contract, publicKey]);

  function onDismiss() {
    navigate(-1);
  }
  return (
    <Dialog
      aria-labelledby="label"
      onDismiss={onDismiss}
      initialFocusRef={buttonRef}
    >
      <Container>
        {(connected && (
          <Tabs
            id="controlled-tab-example"
            activeKey={key}
            onSelect={(k) => setKey(k!)}
          >
            <Tab eventKey="source" title="source">
              <Source />
            </Tab>
            <Tab eventKey="transaction" title="transaction">
              <Transaction />
            </Tab>
          </Tabs>
        )) || <div>connect wallet first</div>}
      </Container>
    </Dialog>
  );
}

function Source() {
  const [heroTokens] = useRecoilState(tokens);

  return (
    <div>
      {heroTokens.map((item) => {
        const { name, decimals } = mintsObject[item.token.info.mint]!;
        return (
          <div key={item.token.address.toString()}>
            <div>name: {name}</div>
            <div>
              amount: {item.token.info.tokenAmount.uiAmount.toFixed(decimals)}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function Transaction() {
  const wallet = useWallet();
  const {
    contract,
    accountInfo,
    loadHerosData: ReloadHeroData,
  } = useContractConfig();
  const [userTransactions, setUserTransactions] = useState<any[]>([]);
  const [depositMintStr, setDepositMintStr] = useState("");
  const [depositAmount, setDepositAmount] = useState("");
  const [expectMintStr, setExpectMintStr] = useState("");
  const [expectAmount, setExpectAmount] = useState("");
  const myMints = useRecoilValue(myHeroMints);
  const { publicKey } = wallet;

  useEffect(() => {
    console.log("---");
    if (!publicKey) return;
    contract.instance.getHeroTrans(publicKey).then((data) => {
      console.log("user markets", data);
      setUserTransactions(data);
    });
  }, [contract, publicKey]);

  const createTrans = useCallback(
    async (
      depositMintStr: string,
      depositMintAmount: number,
      expectMintStr: string,
      expectMintAmount: number
    ) => {
      const depositMint = new PublicKey(depositMintStr);
      const expectMint = new PublicKey(expectMintStr);
      await contract.instance.createHeroTrans(
        wallet,
        depositMint,
        depositMintAmount,
        expectMint,
        expectMintAmount
      );
    },
    [contract, wallet]
  );

  const createNewTrans = useCallback(
    async (event: React.FormEvent) => {
      event.preventDefault();
      console.log({
        depositMintStr,
        depositAmount,
        expectMintStr,
        expectAmount,
      });
      await createTrans(
        depositMintStr,
        Number(depositAmount),
        expectMintStr,
        Number(expectAmount)
      );
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [depositMintStr, depositAmount, expectMintStr, expectAmount]
  );

  const cancelTrans = useCallback(
    async (marketAccount: PublicKey) => {
      await contract.instance.cancelHeroTrans(wallet, marketAccount);
    },
    [contract, wallet]
  );

  // const exchangeTrans = useCallback(async () => {
  //   const marketAccount = new PublicKey(
  //     "58kAgqMCemBfDxu5tb4RnkHZdCiHQdtteThXReciFoGA"
  //   );
  //   await contract.instance.exchangeHeroTrans(wallet, marketAccount);
  // }, [contract, wallet]);

  return (
    <Container className="pt-3 px-1">
      <Row xs={1} md={2} className="g-2">
        {userTransactions.map((item) => {
          return (
            <Col key={item.account.toString()}>
              <Card className="">
                <Card.Body>
                  <Card.Text>
                    {`${
                      mintsObject[item.depositToken.toString()]["name"]
                    }(${Number(item.depositAmount)}) == ${
                      mintsObject[item.receiveToken.toString()]["name"]
                    }(${Number(item.receiveAmount)})`}
                  </Card.Text>
                  <Button
                    variant="outline-dark"
                    size="sm"
                    onClick={() => cancelTrans(item.account)}
                  >
                    cancel
                  </Button>
                  <Button
                    variant="outline-dark"
                    size="sm"
                    onClick={() => console.log(item.account)}
                  >
                    SubmitMarket
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          );
        })}
      </Row>

      <Col className="mt-4">
        <Form onSubmit={createNewTrans}>
          <Row>
            <Col>
              <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>deposit</Form.Label>
                <Form.Select
                  value={depositMintStr}
                  onChange={(e) => {
                    setDepositMintStr(e.target.value);
                  }}
                >
                  <option value={""}>select</option>
                  {myMints.map((item) => {
                    return (
                      <option key={item} value={item}>
                        {mintsObject[item].name}
                      </option>
                    );
                  })}
                </Form.Select>
                <Form.Control
                  type="number"
                  name="depositAmount"
                  step=".001"
                  value={depositAmount}
                  onChange={(e) => {
                    setDepositAmount(e.target.value);
                  }}
                />
              </Form.Group>
            </Col>

            <Col>
              <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>expect</Form.Label>
                <Form.Select
                  value={expectMintStr}
                  onChange={(e) => {
                    setExpectMintStr(e.target.value);
                  }}
                >
                  <option value={""}>select</option>
                  {mints.map((item) => {
                    return (
                      <option key={item} value={item}>
                        {mintsObject[item].name}
                      </option>
                    );
                  })}
                </Form.Select>
                <Form.Control
                  type="number"
                  step=".001"
                  name="expectAmount"
                  value={expectAmount}
                  onChange={(e) => {
                    setExpectAmount(e.target.value);
                  }}
                />
              </Form.Group>
            </Col>
          </Row>
          <Button variant="outline-dark" type="submit">
            CreateNewTransaction
          </Button>
        </Form>
      </Col>
    </Container>
  );
}

export function SelfCenterModalLayout() {
  let navigate = useNavigate();
  let buttonRef = useRef<HTMLButtonElement>(null);

  const [key, setKey] = useState("source");

  function onDismiss() {
    navigate(-1);
  }
  return (
    <Dialog
      aria-labelledby="label"
      onDismiss={onDismiss}
      initialFocusRef={buttonRef}
    >
      <Tabs
        id="controlled-tab-example"
        activeKey={key}
        onSelect={(k) => setKey(k!)}
        className="mb-3"
      >
        <Outlet /> {/** ????????/ */}
        <Tab eventKey="source" title="source">
          <div>source</div>
        </Tab>
        <Tab eventKey="transaction" title="transaction">
          <div>transaction</div>
        </Tab>
      </Tabs>
    </Dialog>
  );
}
