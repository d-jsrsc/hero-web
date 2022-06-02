/* eslint-disable @typescript-eslint/no-unused-vars */
import * as anchor from "@project-serum/anchor";
import {
  PublicKey,
  Connection,
  AccountInfo,
  SystemProgram,
  Transaction,
  clusterApiUrl,
  Keypair,
  sendAndConfirmTransaction,
} from "@solana/web3.js";
import { BN, Program, AnchorProvider, web3 } from "@project-serum/anchor";
import {
  TOKEN_PROGRAM_ID,
  getAccount,
  getAssociatedTokenAddress,
  createAssociatedTokenAccountInstruction,
  getOrCreateAssociatedTokenAccount,
  createTransferCheckedInstruction,
  createMint,
  createInitializeMintInstruction,
  MINT_SIZE,
  ASSOCIATED_TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import { WalletContextState } from "@solana/wallet-adapter-react";
import log from "loglevel";

import { NFTDataItem, HeroNode, HeroTokens } from "./types";
import { HeroMetadata } from "./hero_metadata";

import { Nft, Metaplex } from "@metaplex-foundation/js-next";
const MetaplexNext = require("@metaplex-foundation/js-next");

const ROOT_SEED_STR = "root_node_pda_seed";
const NODE_SEED_STR = "node_pda_seed";

const idl = require("./hero_metadata.json");
const heroMints = require("./mints.json");

const logger = log.getLogger("ContractInstance");

const PROGRAM_ID = new PublicKey(idl.metadata.address);

export class Contract {
  private static _instance: Contract = new Contract();

  // private _wallet: WalletContextState | null = null;
  private _connection: Connection | null = null;
  private _program: Program<HeroMetadata> | null = null;
  private _metaplex: Metaplex | null = null;

  constructor() {
    if (Contract._instance) {
      throw new Error(
        "Error: Instantiation failed: Use SingletonClass.getInstance() instead of new."
      );
    }
    Contract._instance = this;
  }

  public static getInstance(): Contract {
    return Contract._instance;
  }

  private initProgram(connection: Connection) {
    // logger.info("Contract initProgram");
    const provider = new AnchorProvider(
      connection,
      (window as any).solana,
      AnchorProvider.defaultOptions()
    );
    const program = new Program(
      idl,
      PROGRAM_ID,
      provider
    ) as Program<HeroMetadata>;
    this._program = program;
    this._metaplex = new MetaplexNext.Metaplex(connection);
  }

  // public setWallet(wallet: WalletContextState) {
  //   this._wallet = wallet;
  // }

  public setConnection(conn: Connection) {
    this._connection = conn;
    this.initProgram(conn);
  }

  /**
   * 获取用户有效的 NFT
   * @param owner
   * @returns
   */
  public async getValidHeroTokensWithOwner(owner: PublicKey) {
    if (!this._connection) {
      return [];
    }
    const tokens = await this._connection.getParsedTokenAccountsByOwner(owner, {
      programId: TOKEN_PROGRAM_ID,
    });

    // initial filter - only tokens with 0 decimals & of which 1 is present in the wallet
    const filteredToken = tokens.value
      .filter((t) => {
        const mint = t.account.data.parsed.info.mint;
        return heroMints[mint];
      })
      .map((t) => ({
        address: t.pubkey,
        info: t.account.data.parsed.info,
      }));
    return filteredToken;
  }

  public async getHistory(owner: PublicKey, options = { limit: 20 }) {
    if (!this._connection) {
      throw new Error("");
    }
    const connection = this._connection;
    const history = await connection.getConfirmedSignaturesForAddress2(
      owner,
      options
    );

    return history;
  }

  public async getHeros(owner: PublicKey): Promise<Array<HeroTokens>> {
    if (!this._connection || !this._program) {
      throw new Error("");
    }
    const program = this._program;
    const connection = this._connection;

    const filerTokens = await this.getValidHeroTokensWithOwner(owner);
    const heroPDAPromise = filerTokens.map(async ({ info }) => {
      const [mintMetadataAccount] = await PublicKey.findProgramAddress(
        [Buffer.from("hero-metadata"), new PublicKey(info.mint).toBuffer()],
        program.programId
      );
      return mintMetadataAccount;
    });

    const heroPDAs = await Promise.all(heroPDAPromise);

    const result = (await connection.getMultipleAccountsInfo(heroPDAs))
      .map((item, index) => {
        if (item == null) return null;
        const token = filerTokens[index];
        return {
          pdaAccountInfo: item,
          token,
        };
      })
      .flatMap((item) => (item && [item]) || []);

    const heros = result.map((item) => {
      const metadataData = program.account.metadata.coder.accounts.decode(
        "Metadata",
        item.pdaAccountInfo.data
      );
      return {
        metadataData,
        token: item.token,
      };
    });
    return heros;
  }

  public async getHeroTrans(owner: PublicKey) {
    if (!this._program) {
      throw new Error("");
    }

    const program = this._program;

    const [user_markets, _user_markets_bump] =
      await PublicKey.findProgramAddress(
        [
          Buffer.from(anchor.utils.bytes.utf8.encode("user-markets")),
          owner.toBuffer(),
        ],
        program.programId
      );
    const marketsData = await program.account.userMarkets.fetch(user_markets);
    console.log(marketsData);
    const marketsAccountsInfo =
      await program.account.marketAccount.fetchMultiple(marketsData.markets);

    return marketsData.markets.map((item, index) => {
      const info = marketsAccountsInfo[index];
      return {
        account: item,
        ...info,
      };
    });
  }

  public async createHeroTrans(
    wallet: WalletContextState,
    depositMint: PublicKey,
    expectMint: PublicKey
  ) {
    if (!this._connection || !this._program || !wallet.publicKey) {
      throw new Error("");
    }

    const program = this._program;
    const connection = this._connection;

    const marketAccount = Keypair.generate();
    const [vault_account_pda, vault_account_bump] =
      await PublicKey.findProgramAddress(
        [
          Buffer.from(anchor.utils.bytes.utf8.encode("vault-token-seed")),
          marketAccount.publicKey.toBuffer(),
        ],
        program.programId
      );

    const [user_markets, _user_markets_bump] =
      await PublicKey.findProgramAddress(
        [
          Buffer.from(anchor.utils.bytes.utf8.encode("user-markets")),
          wallet.publicKey.toBuffer(),
        ],
        program.programId
      );

    const depositTokenAccount = await getAssociatedTokenAddress(
      depositMint,
      wallet.publicKey
    );
    //
    let depositTokenAccountExist = await connection.getAccountInfo(
      depositTokenAccount
    );
    if (depositTokenAccountExist === null)
      throw new Error("depositTokenAccount not exist");

    const receiveTokenAccount = await getAssociatedTokenAddress(
      expectMint,
      wallet.publicKey
    );

    let receiveTokenAccountExist = await connection.getAccountInfo(
      receiveTokenAccount
    );

    // console.log({ depositTokenAccountExist, receiveTokenAccountExist });

    const tx = new Transaction();
    if (receiveTokenAccountExist === null) {
      const ataInstruction = createAssociatedTokenAccountInstruction(
        wallet.publicKey,
        receiveTokenAccount,
        wallet.publicKey,
        expectMint
      );
      tx.add(ataInstruction);
      console.log("add ataInstruction");
    }

    const createInstruction = await program.methods
      .marketCreate(
        vault_account_bump,
        new anchor.BN(1),
        new anchor.BN(5),
        depositMint,
        expectMint
      )
      .accounts({
        creator: wallet.publicKey,
        vaultAccount: vault_account_pda,
        mint: depositMint,
        depositTokenAccount: depositTokenAccount,
        receiveTokenAccount: receiveTokenAccount,
        marketAccount: marketAccount.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
        rent: anchor.web3.SYSVAR_RENT_PUBKEY,
        tokenProgram: TOKEN_PROGRAM_ID,
        userMarkets: user_markets,
      })
      .preInstructions([
        await program.account.marketAccount.createInstruction(marketAccount),
      ])
      .transaction();

    tx.add(createInstruction);
    const signature = await wallet.sendTransaction(tx, connection, {
      signers: [marketAccount],
    });
    const latestBlockHash = await connection.getLatestBlockhash();
    const result = await connection.confirmTransaction({
      blockhash: latestBlockHash.blockhash,
      lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
      signature: signature,
    });
    console.log(result, marketAccount.publicKey.toString());
  }

  public async cancelHeroTrans(
    wallet: WalletContextState,
    marketAccount: PublicKey
  ) {
    if (!this._connection || !this._program || !wallet.publicKey) {
      throw new Error("");
    }

    const program = this._program;
    const connection = this._connection;

    const [user_markets, _user_markets_bump] =
      await PublicKey.findProgramAddress(
        [
          Buffer.from(anchor.utils.bytes.utf8.encode("user-markets")),
          wallet.publicKey.toBuffer(),
        ],
        program.programId
      );

    const data = await program.account.marketAccount.fetch(marketAccount);
    // console.log(data);

    const [vault_account_pda, _vault_account_bump] =
      await PublicKey.findProgramAddress(
        [
          Buffer.from(anchor.utils.bytes.utf8.encode("vault-token-seed")),
          marketAccount.toBuffer(),
        ],
        program.programId
      );

    const [vault_authority_pda, _vault_authority_bump] =
      await PublicKey.findProgramAddress(
        [
          Buffer.from(anchor.utils.bytes.utf8.encode("vault-authority-seed")),
          marketAccount.toBuffer(),
        ],
        program.programId
      );

    const tx = await program.methods
      .marketCancel()
      .accounts({
        creator: wallet.publicKey,
        depositTokenAccount: data.depositTokenAccount,
        vaultAccount: vault_account_pda,
        vaultAuthority: vault_authority_pda,
        marketAccount: marketAccount,
        tokenProgram: TOKEN_PROGRAM_ID,
        userMarkets: user_markets,
      })
      .transaction();
    const signature = await wallet.sendTransaction(tx, connection);
    const latestBlockHash = await connection.getLatestBlockhash();
    const result = await connection.confirmTransaction({
      blockhash: latestBlockHash.blockhash,
      lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
      signature: signature,
    });
    console.log(result);
  }

  public async exchangeHeroTrans(
    wallet: WalletContextState,
    marketAccount: PublicKey
  ) {
    if (!this._connection || !this._program || !wallet.publicKey) {
      throw new Error("");
    }
    const program = this._program;
    const connection = this._connection;

    const marketData = await program.account.marketAccount.fetch(marketAccount);

    const [user_markets, _user_markets_bump] =
      await PublicKey.findProgramAddress(
        [
          Buffer.from(anchor.utils.bytes.utf8.encode("user-markets")),
          marketData.creator.toBuffer(),
        ],
        program.programId
      );

    const [vault_account_pda, _vault_account_bump] =
      await PublicKey.findProgramAddress(
        [
          Buffer.from(anchor.utils.bytes.utf8.encode("vault-token-seed")),
          marketAccount.toBuffer(),
        ],
        program.programId
      );

    const [vault_authority_pda, _vault_authority_bump] =
      await PublicKey.findProgramAddress(
        [
          Buffer.from(anchor.utils.bytes.utf8.encode("vault-authority-seed")),
          marketAccount.toBuffer(),
        ],
        program.programId
      );

    const takerDepositTokenAccount = await getAssociatedTokenAddress(
      marketData.receiveToken,
      wallet.publicKey
    );
    //
    let takerDepositTokenAccountExist = await connection.getAccountInfo(
      takerDepositTokenAccount
    );
    if (takerDepositTokenAccountExist === null)
      throw new Error("takerDepositTokenAccountExist not exist");

    const takerReceiveTokenAccount = await getAssociatedTokenAddress(
      marketData.depositToken,
      wallet.publicKey
    );

    let takerRceiveTokenAccountExist = await connection.getAccountInfo(
      takerReceiveTokenAccount
    );

    console.log({ takerRceiveTokenAccountExist });

    const tx = new Transaction();
    if (takerRceiveTokenAccountExist === null) {
      const ataInstruction = createAssociatedTokenAccountInstruction(
        wallet.publicKey,
        takerReceiveTokenAccount,
        wallet.publicKey,
        marketData.depositToken
      );
      tx.add(ataInstruction);
      console.log("add ataInstruction");
    }

    const heroTrans = await program.methods
      .marketExchange()
      .accounts({
        taker: wallet.publicKey,
        takerDepositTokenAccount: takerDepositTokenAccount,
        takerReceiveTokenAccount: takerReceiveTokenAccount,
        creatorDepositTokenAccount: marketData.depositTokenAccount,
        creatorReceiveTokenAccount: marketData.receiveTokenAccount,
        userMarkets: user_markets,
        creator: marketData.creator,
        marketAccount: marketAccount,
        vaultAccount: vault_account_pda,
        vaultAuthority: vault_authority_pda,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .transaction();
    tx.add(heroTrans);

    const signature = await wallet.sendTransaction(tx, connection);
    const latestBlockHash = await connection.getLatestBlockhash();
    const result = await connection.confirmTransaction({
      blockhash: latestBlockHash.blockhash,
      lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
      signature: signature,
    });
    console.log(result);
  }

  public async getHeroMetadata(
    wallet: WalletContextState,
    mintStr: string,
    amount: number
  ) {
    if (!this._connection || !this._program || !wallet.publicKey) {
      throw new Error("");
    }
    const program = this._program;
    const connection = this._connection;
    const mint = new PublicKey(mintStr);

    const [mintAuthority, mintAuthorityBump] =
      await PublicKey.findProgramAddress(
        [Buffer.from("mint-hero-authority"), mint.toBuffer()],
        program.programId
      );
    const [mintMetadataAccount] = await PublicKey.findProgramAddress(
      [Buffer.from("hero-metadata"), mint.toBuffer()],
      program.programId
    );
    const mintTokenAccount = await getAssociatedTokenAddress(
      mint,
      wallet.publicKey
    );
    console.log({
      mintAuthority: mintAuthority.toString(),
      mintMetadataAccount: mintMetadataAccount.toString(),
      mintTokenAccount: mintTokenAccount.toString(),
    });
    const tx = await program.methods
      .mintHeroToUser(mintAuthorityBump, new BN(amount))
      .accounts({
        heroMint: mint,
        heroMetadataAccount: mintMetadataAccount,
        heroMintAuthority: mintAuthority,
        heroMintTokenAccount: mintTokenAccount,
        tokenProgram: TOKEN_PROGRAM_ID,
        user: wallet.publicKey,

        systemProgram: SystemProgram.programId,
        rent: anchor.web3.SYSVAR_RENT_PUBKEY,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
      })
      .transaction();
    const signature = await wallet.sendTransaction(tx, connection);
    const result = await connection.confirmTransaction(signature, "processed");
    console.log(result);
  }

  // private async createNewMetadata(wallet: WalletContextState) {
  //   if (!this._connection || !this._program || !wallet.publicKey) {
  //     throw new Error("");
  //   }
  //   const program = this._program;
  //   const connection = this._connection;

  //   const mintKp = Keypair.generate();
  //   const mint = mintKp.publicKey;

  //   console.log("mint", mint.toString());

  //   const [mintAuthority, mintAuthorityBump] =
  //     await PublicKey.findProgramAddress(
  //       [Buffer.from("mint-hero-authority"), mint.toBuffer()],
  //       program.programId
  //     );

  //   const [mintMetadataAccount] = await PublicKey.findProgramAddress(
  //     [Buffer.from("hero-metadata"), mint.toBuffer()],
  //     program.programId
  //   );
  //   console.log({
  //     mint: mint.toString(),
  //     mintMetadataAccount: mintMetadataAccount.toString(),
  //     mintAuthority: mintAuthority.toString(),
  //   });

  //   const lamports = await connection.getMinimumBalanceForRentExemption(
  //     MINT_SIZE
  //   );

  //   const createAccountInstruction = SystemProgram.createAccount({
  //     fromPubkey: wallet.publicKey,
  //     newAccountPubkey: mint,
  //     space: MINT_SIZE,
  //     lamports: lamports,
  //     programId: TOKEN_PROGRAM_ID,
  //   });

  //   const mintInstruction = createInitializeMintInstruction(
  //     mint,
  //     0,
  //     mintAuthority,
  //     null
  //   );
  //   const metadataInstruction = await this._program!.methods.heroMetadataInit(
  //     "Ruiwen",
  //     "lol",
  //     new BN(10)
  //   )
  //     .accounts({
  //       heroMint: mint,
  //       metadataAccount: mintMetadataAccount,
  //       creator: wallet.publicKey!,

  //       systemProgram: SystemProgram.programId,
  //       rent: anchor.web3.SYSVAR_RENT_PUBKEY,
  //     })
  //     .signers([])
  //     .instruction();

  //   const tx = new Transaction().add(
  //     ...[createAccountInstruction, mintInstruction, metadataInstruction]
  //   );

  //   const signature = await wallet.sendTransaction(tx, connection, {
  //     signers: [mintKp],
  //   });
  //   const result = await connection.confirmTransaction(signature, "processed");
  //   console.log(result);
  // }
}

async function sleep(s: number) {
  await new Promise((resolve, reject) => {
    setTimeout(resolve, s * 1000);
  });
}
