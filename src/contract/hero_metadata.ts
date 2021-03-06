export type HeroMetadata = {
  "version": "0.1.0";
  "name": "hero_metadata";
  "instructions": [
    {
      "name": "initMintWithMetadata";
      "accounts": [
        {
          "name": "metadataAccount";
          "isMut": true;
          "isSigner": false;
        },
        {
          "name": "mint";
          "isMut": true;
          "isSigner": true;
        },
        {
          "name": "creator";
          "isMut": true;
          "isSigner": true;
        },
        {
          "name": "systemProgram";
          "isMut": false;
          "isSigner": false;
        },
        {
          "name": "rent";
          "isMut": false;
          "isSigner": false;
        },
        {
          "name": "tokenProgram";
          "isMut": false;
          "isSigner": false;
        }
      ];
      "args": [
        {
          "name": "name";
          "type": "string";
        },
        {
          "name": "symbol";
          "type": "string";
        },
        {
          "name": "amount";
          "type": "u64";
        },
        {
          "name": "lamports";
          "type": "u64";
        },
        {
          "name": "decimals";
          "type": "u8";
        }
      ];
    },
    {
      "name": "mintHeroToUser";
      "accounts": [
        {
          "name": "heroMint";
          "isMut": true;
          "isSigner": false;
        },
        {
          "name": "heroMintAuthority";
          "isMut": false;
          "isSigner": false;
        },
        {
          "name": "heroMetadataAccount";
          "isMut": true;
          "isSigner": false;
        },
        {
          "name": "heroMintTokenAccount";
          "isMut": true;
          "isSigner": false;
        },
        {
          "name": "user";
          "isMut": true;
          "isSigner": true;
        },
        {
          "name": "tokenProgram";
          "isMut": false;
          "isSigner": false;
        },
        {
          "name": "systemProgram";
          "isMut": false;
          "isSigner": false;
        },
        {
          "name": "rent";
          "isMut": false;
          "isSigner": false;
        },
        {
          "name": "associatedTokenProgram";
          "isMut": false;
          "isSigner": false;
        }
      ];
      "args": [
        {
          "name": "mintAuthorityBump";
          "type": "u8";
        },
        {
          "name": "amount";
          "type": "u64";
        }
      ];
    },
    {
      "name": "incrMetadataAmount";
      "accounts": [
        {
          "name": "metadataAccount";
          "isMut": true;
          "isSigner": false;
        },
        {
          "name": "adder";
          "isMut": true;
          "isSigner": true;
        }
      ];
      "args": [
        {
          "name": "incrAmount";
          "type": "u64";
        }
      ];
    },
    {
      "name": "marketCreate";
      "accounts": [
        {
          "name": "mint";
          "isMut": false;
          "isSigner": false;
        },
        {
          "name": "vaultAccount";
          "isMut": true;
          "isSigner": false;
        },
        {
          "name": "marketAccount";
          "isMut": true;
          "isSigner": false;
        },
        {
          "name": "depositTokenAccount";
          "isMut": true;
          "isSigner": false;
        },
        {
          "name": "receiveTokenAccount";
          "isMut": false;
          "isSigner": false;
        },
        {
          "name": "userMarkets";
          "isMut": true;
          "isSigner": false;
        },
        {
          "name": "creator";
          "isMut": true;
          "isSigner": true;
        },
        {
          "name": "systemProgram";
          "isMut": false;
          "isSigner": false;
        },
        {
          "name": "rent";
          "isMut": false;
          "isSigner": false;
        },
        {
          "name": "tokenProgram";
          "isMut": false;
          "isSigner": false;
        }
      ];
      "args": [
        {
          "name": "vaultAccountBump";
          "type": "u8";
        },
        {
          "name": "depositAmount";
          "type": "u64";
        },
        {
          "name": "receiveAmount";
          "type": "u64";
        },
        {
          "name": "depositToken";
          "type": "publicKey";
        },
        {
          "name": "receiveToken";
          "type": "publicKey";
        }
      ];
    },
    {
      "name": "marketCancel";
      "accounts": [
        {
          "name": "creator";
          "isMut": true;
          "isSigner": true;
        },
        {
          "name": "depositTokenAccount";
          "isMut": true;
          "isSigner": false;
        },
        {
          "name": "vaultAccount";
          "isMut": true;
          "isSigner": false;
        },
        {
          "name": "vaultAuthority";
          "isMut": false;
          "isSigner": false;
        },
        {
          "name": "marketAccount";
          "isMut": true;
          "isSigner": false;
        },
        {
          "name": "userMarkets";
          "isMut": true;
          "isSigner": false;
        },
        {
          "name": "tokenProgram";
          "isMut": false;
          "isSigner": false;
        }
      ];
      "args": [];
    },
    {
      "name": "marketExchange";
      "accounts": [
        {
          "name": "taker";
          "isMut": false;
          "isSigner": true;
        },
        {
          "name": "takerDepositTokenAccount";
          "isMut": true;
          "isSigner": false;
        },
        {
          "name": "takerReceiveTokenAccount";
          "isMut": true;
          "isSigner": false;
        },
        {
          "name": "creatorDepositTokenAccount";
          "isMut": true;
          "isSigner": false;
        },
        {
          "name": "creatorReceiveTokenAccount";
          "isMut": true;
          "isSigner": false;
        },
        {
          "name": "creator";
          "isMut": true;
          "isSigner": false;
        },
        {
          "name": "marketAccount";
          "isMut": true;
          "isSigner": false;
        },
        {
          "name": "vaultAccount";
          "isMut": true;
          "isSigner": false;
        },
        {
          "name": "vaultAuthority";
          "isMut": false;
          "isSigner": false;
        },
        {
          "name": "userMarkets";
          "isMut": true;
          "isSigner": false;
        },
        {
          "name": "tokenProgram";
          "isMut": false;
          "isSigner": false;
        }
      ];
      "args": [];
    }
  ];
  "accounts": [
    {
      "name": "marketAccount";
      "type": {
        "kind": "struct";
        "fields": [
          {
            "name": "creator";
            "type": "publicKey";
          },
          {
            "name": "depositTokenAccount";
            "type": "publicKey";
          },
          {
            "name": "depositToken";
            "type": "publicKey";
          },
          {
            "name": "depositAmount";
            "type": "u64";
          },
          {
            "name": "receiveTokenAccount";
            "type": "publicKey";
          },
          {
            "name": "receiveToken";
            "type": "publicKey";
          },
          {
            "name": "receiveAmount";
            "type": "u64";
          },
          {
            "name": "status";
            "type": {
              "defined": "MarketStatus";
            };
          }
        ];
      };
    },
    {
      "name": "userMarkets";
      "type": {
        "kind": "struct";
        "fields": [
          {
            "name": "markets";
            "type": {
              "vec": "publicKey";
            };
          }
        ];
      };
    },
    {
      "name": "metadata";
      "type": {
        "kind": "struct";
        "fields": [
          {
            "name": "creator";
            "type": "publicKey";
          },
          {
            "name": "mint";
            "type": "publicKey";
          },
          {
            "name": "name";
            "type": "string";
          },
          {
            "name": "symbol";
            "type": "string";
          },
          {
            "name": "amount";
            "type": "u64";
          },
          {
            "name": "amountLeft";
            "type": "u64";
          }
        ];
      };
    }
  ];
  "types": [
    {
      "name": "MarketStatus";
      "type": {
        "kind": "enum";
        "variants": [
          {
            "name": "Created";
          },
          {
            "name": "Cancel";
          },
          {
            "name": "Done";
          }
        ];
      };
    }
  ];
  "errors": [
    {
      "code": 6000;
      "name": "InvalidAmount";
      "msg": "InvalidAmount take";
    },
    {
      "code": 6001;
      "name": "InvalidAuthority";
      "msg": "Current owner is not the authority of the parent token";
    },
    {
      "code": 6002;
      "name": "InvalidExtractAttempt";
      "msg": "Only Reversible Synthetic Tokens can be extracted";
    },
    {
      "code": 6003;
      "name": "InvalidBurnType";
      "msg": "Wrong type of burn instruction for the token";
    },
    {
      "code": 6004;
      "name": "InvalidTransferCrankProcess";
      "msg": "Wrong opration of crank process instruction for the token";
    },
    {
      "code": 6005;
      "name": "InvalidTransferCrankEnd";
      "msg": "Wrong opration of crank end instruction for the token";
    }
  ];
};

export const IDL: HeroMetadata = {
  "version": "0.1.0",
  "name": "hero_metadata",
  "instructions": [
    {
      "name": "initMintWithMetadata",
      "accounts": [
        {
          "name": "metadataAccount",
          "isMut": true,
          "isSigner": false,
        },
        {
          "name": "mint",
          "isMut": true,
          "isSigner": true,
        },
        {
          "name": "creator",
          "isMut": true,
          "isSigner": true,
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false,
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false,
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false,
        },
      ],
      "args": [
        {
          "name": "name",
          "type": "string",
        },
        {
          "name": "symbol",
          "type": "string",
        },
        {
          "name": "amount",
          "type": "u64",
        },
        {
          "name": "lamports",
          "type": "u64",
        },
        {
          "name": "decimals",
          "type": "u8",
        },
      ],
    },
    {
      "name": "mintHeroToUser",
      "accounts": [
        {
          "name": "heroMint",
          "isMut": true,
          "isSigner": false,
        },
        {
          "name": "heroMintAuthority",
          "isMut": false,
          "isSigner": false,
        },
        {
          "name": "heroMetadataAccount",
          "isMut": true,
          "isSigner": false,
        },
        {
          "name": "heroMintTokenAccount",
          "isMut": true,
          "isSigner": false,
        },
        {
          "name": "user",
          "isMut": true,
          "isSigner": true,
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false,
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false,
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false,
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false,
        },
      ],
      "args": [
        {
          "name": "mintAuthorityBump",
          "type": "u8",
        },
        {
          "name": "amount",
          "type": "u64",
        },
      ],
    },
    {
      "name": "incrMetadataAmount",
      "accounts": [
        {
          "name": "metadataAccount",
          "isMut": true,
          "isSigner": false,
        },
        {
          "name": "adder",
          "isMut": true,
          "isSigner": true,
        },
      ],
      "args": [
        {
          "name": "incrAmount",
          "type": "u64",
        },
      ],
    },
    {
      "name": "marketCreate",
      "accounts": [
        {
          "name": "mint",
          "isMut": false,
          "isSigner": false,
        },
        {
          "name": "vaultAccount",
          "isMut": true,
          "isSigner": false,
        },
        {
          "name": "marketAccount",
          "isMut": true,
          "isSigner": false,
        },
        {
          "name": "depositTokenAccount",
          "isMut": true,
          "isSigner": false,
        },
        {
          "name": "receiveTokenAccount",
          "isMut": false,
          "isSigner": false,
        },
        {
          "name": "userMarkets",
          "isMut": true,
          "isSigner": false,
        },
        {
          "name": "creator",
          "isMut": true,
          "isSigner": true,
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false,
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false,
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false,
        },
      ],
      "args": [
        {
          "name": "vaultAccountBump",
          "type": "u8",
        },
        {
          "name": "depositAmount",
          "type": "u64",
        },
        {
          "name": "receiveAmount",
          "type": "u64",
        },
        {
          "name": "depositToken",
          "type": "publicKey",
        },
        {
          "name": "receiveToken",
          "type": "publicKey",
        },
      ],
    },
    {
      "name": "marketCancel",
      "accounts": [
        {
          "name": "creator",
          "isMut": true,
          "isSigner": true,
        },
        {
          "name": "depositTokenAccount",
          "isMut": true,
          "isSigner": false,
        },
        {
          "name": "vaultAccount",
          "isMut": true,
          "isSigner": false,
        },
        {
          "name": "vaultAuthority",
          "isMut": false,
          "isSigner": false,
        },
        {
          "name": "marketAccount",
          "isMut": true,
          "isSigner": false,
        },
        {
          "name": "userMarkets",
          "isMut": true,
          "isSigner": false,
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false,
        },
      ],
      "args": [],
    },
    {
      "name": "marketExchange",
      "accounts": [
        {
          "name": "taker",
          "isMut": false,
          "isSigner": true,
        },
        {
          "name": "takerDepositTokenAccount",
          "isMut": true,
          "isSigner": false,
        },
        {
          "name": "takerReceiveTokenAccount",
          "isMut": true,
          "isSigner": false,
        },
        {
          "name": "creatorDepositTokenAccount",
          "isMut": true,
          "isSigner": false,
        },
        {
          "name": "creatorReceiveTokenAccount",
          "isMut": true,
          "isSigner": false,
        },
        {
          "name": "creator",
          "isMut": true,
          "isSigner": false,
        },
        {
          "name": "marketAccount",
          "isMut": true,
          "isSigner": false,
        },
        {
          "name": "vaultAccount",
          "isMut": true,
          "isSigner": false,
        },
        {
          "name": "vaultAuthority",
          "isMut": false,
          "isSigner": false,
        },
        {
          "name": "userMarkets",
          "isMut": true,
          "isSigner": false,
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false,
        },
      ],
      "args": [],
    },
  ],
  "accounts": [
    {
      "name": "marketAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "creator",
            "type": "publicKey",
          },
          {
            "name": "depositTokenAccount",
            "type": "publicKey",
          },
          {
            "name": "depositToken",
            "type": "publicKey",
          },
          {
            "name": "depositAmount",
            "type": "u64",
          },
          {
            "name": "receiveTokenAccount",
            "type": "publicKey",
          },
          {
            "name": "receiveToken",
            "type": "publicKey",
          },
          {
            "name": "receiveAmount",
            "type": "u64",
          },
          {
            "name": "status",
            "type": {
              "defined": "MarketStatus",
            },
          },
        ],
      },
    },
    {
      "name": "userMarkets",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "markets",
            "type": {
              "vec": "publicKey",
            },
          },
        ],
      },
    },
    {
      "name": "metadata",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "creator",
            "type": "publicKey",
          },
          {
            "name": "mint",
            "type": "publicKey",
          },
          {
            "name": "name",
            "type": "string",
          },
          {
            "name": "symbol",
            "type": "string",
          },
          {
            "name": "amount",
            "type": "u64",
          },
          {
            "name": "amountLeft",
            "type": "u64",
          },
        ],
      },
    },
  ],
  "types": [
    {
      "name": "MarketStatus",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "Created",
          },
          {
            "name": "Cancel",
          },
          {
            "name": "Done",
          },
        ],
      },
    },
  ],
  "errors": [
    {
      "code": 6000,
      "name": "InvalidAmount",
      "msg": "InvalidAmount take",
    },
    {
      "code": 6001,
      "name": "InvalidAuthority",
      "msg": "Current owner is not the authority of the parent token",
    },
    {
      "code": 6002,
      "name": "InvalidExtractAttempt",
      "msg": "Only Reversible Synthetic Tokens can be extracted",
    },
    {
      "code": 6003,
      "name": "InvalidBurnType",
      "msg": "Wrong type of burn instruction for the token",
    },
    {
      "code": 6004,
      "name": "InvalidTransferCrankProcess",
      "msg": "Wrong opration of crank process instruction for the token",
    },
    {
      "code": 6005,
      "name": "InvalidTransferCrankEnd",
      "msg": "Wrong opration of crank end instruction for the token",
    },
  ],
};
