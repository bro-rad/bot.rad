# COTI quickstart

This is the short execution path for adding COTI support to a Scaffold-ETH app.

## 0) Check wallet and key creation first

If the request is about creating a COTI account, generating a private key, importing a wallet, or handling recovery, validate the exact wallet docs before writing code.

- Create or import the account using the official COTI wallet flow.
- Store the key in encrypted env or secure wallet storage. Never commit raw keys.
- If the app handles privacy-sensitive data, confirm whether local decryption or wallet-side key handling is required.

## 1) Decide the integration model

- Standard COTI EVM integration: you just need wallet/RPC/chain config and contract deployment on COTI mainnet or testnet.
- Privacy-aware COTI flow: you are using COTI privacy mechanisms, encrypted inputs, async results, or a hybrid host-EVM + COTI model.

If you are doing privacy-sensitive logic, use the COTI testnet first unless the docs explicitly say otherwise.

## 2) Use the correct COTI network

Mainnet:
- Chain ID: 2632500
- RPC: https://mainnet.coti.io/rpc
- WS: wss://mainnet.coti.io/ws
- Explorer: https://mainnet.cotiscan.io

Testnet:
- Chain ID: 7082400
- RPC: https://testnet.coti.io/rpc
- WS: wss://testnet.coti.io/ws
- Explorer: https://testnet.cotiscan.io

## 3) Add a custom viem chain

```ts
import { defineChain } from "viem";

export const cotiMainnet = defineChain({
  id: 2632500,
  name: "COTI Mainnet",
  nativeCurrency: { name: "COTI", symbol: "COTI", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://mainnet.coti.io/rpc"] },
    public: { http: ["https://mainnet.coti.io/rpc"] },
  },
  blockExplorers: {
    default: { name: "COTIScan", url: "https://mainnet.cotiscan.io" },
  },
  testnet: false,
});
```

## 4) Do not confuse local dev with COTI privacy testing

- Local Hardhat/Scaffold-ETH chains are fine for app plumbing.
- Real COTI privacy behavior should be validated against COTI testnet.
- Don’t assume localhost = COTI privacy environment.

## 5) Verify after deployment

Before verifying a contract:
- confirm the target chain is the real COTI network
- confirm the deployed address and bytecode
- use the correct compiler version and settings
- verify against the correct COTI explorer for that network

## 6) For privacy flows

If the app needs private data or async callback behavior:
- model encrypted inputs and results
- plan for pending/completed/failed states
- keep host EVM coordination separate from COTI privacy execution
- check docs.coti.io before assuming normal transparent EVM behavior

## 7) Default rule

When unsure, prefer the official docs.coti.io guidance over generic Ethereum assumptions.
