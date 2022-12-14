export const crolioABI = [
  {
    inputs: [
      {
        internalType: "address",
        name: "swapRouter",
        type: "address",
      },
      {
        internalType: "address",
        name: "USDCContract",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [],
    name: "INVESTED_AMOUNT_0",
    type: "error",
  },
  {
    inputs: [],
    name: "UNEQUAL_TOKENS_AND_WEIGHTS",
    type: "error",
  },
  {
    inputs: [],
    name: "WEIGHTAGE_NOT_100",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "bucketId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "string",
        name: "bucketName",
        type: "string",
      },
      {
        indexed: false,
        internalType: "string",
        name: "description",
        type: "string",
      },
      {
        indexed: false,
        internalType: "address[]",
        name: "tokens",
        type: "address[]",
      },
      {
        indexed: false,
        internalType: "uint256[]",
        name: "weightages",
        type: "uint256[]",
      },
      {
        indexed: false,
        internalType: "address",
        name: "creator",
        type: "address",
      },
    ],
    name: "BucketCreated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "bucketId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amountInvested",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "investorAddress",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address[]",
        name: "tokens",
        type: "address[]",
      },
      {
        indexed: false,
        internalType: "uint256[]",
        name: "holdingsBought",
        type: "uint256[]",
      },
    ],
    name: "InvestedInBucket",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "bucketId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amountOut",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "investorAddress",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address[]",
        name: "tokens",
        type: "address[]",
      },
      {
        indexed: false,
        internalType: "uint256[]",
        name: "holdingsSold",
        type: "uint256[]",
      },
    ],
    name: "WithdrawnFromBucket",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "bucketDetails",
    outputs: [
      {
        internalType: "string",
        name: "name",
        type: "string",
      },
      {
        internalType: "string",
        name: "description",
        type: "string",
      },
      {
        internalType: "address",
        name: "creator",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "name",
        type: "string",
      },
      {
        internalType: "string",
        name: "description",
        type: "string",
      },
      {
        internalType: "address[]",
        name: "tokens",
        type: "address[]",
      },
      {
        internalType: "uint256[]",
        name: "weightage",
        type: "uint256[]",
      },
    ],
    name: "createBucket",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_bucketId",
        type: "uint256",
      },
    ],
    name: "fetchBucketDetails",
    outputs: [
      {
        components: [
          {
            internalType: "string",
            name: "name",
            type: "string",
          },
          {
            internalType: "string",
            name: "description",
            type: "string",
          },
          {
            internalType: "address[]",
            name: "tokens",
            type: "address[]",
          },
          {
            internalType: "uint256[]",
            name: "weightages",
            type: "uint256[]",
          },
          {
            internalType: "address",
            name: "creator",
            type: "address",
          },
        ],
        internalType: "struct Crolio.Bucket",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_bucketId",
        type: "uint256",
      },
    ],
    name: "getAllUserInvestmentDetails",
    outputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "totalUSDCInvested",
            type: "uint256",
          },
          {
            internalType: "uint256[]",
            name: "holdings",
            type: "uint256[]",
          },
        ],
        internalType: "struct Crolio.UserInvestment",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_bucketId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_investValue",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_deadline",
        type: "uint256",
      },
      {
        internalType: "uint8",
        name: "v",
        type: "uint8",
      },
      {
        internalType: "bytes32",
        name: "r",
        type: "bytes32",
      },
      {
        internalType: "bytes32",
        name: "s",
        type: "bytes32",
      },
    ],
    name: "invest",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "supportedTokens",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_bucketId",
        type: "uint256",
      },
    ],
    name: "withdraw",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
];

export const crolioAddress = "0x7717F536d5a2cB738586AF30bD588F3F8954DE7a";
