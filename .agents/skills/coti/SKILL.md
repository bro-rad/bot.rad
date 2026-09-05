---
name: coti
description: "Use when the request involves COTI, COTI mainnet/testnet, privacy EVM work, Privacy on Demand, COTI wallet or RPC integration, or chain config for EVM apps. Start from official docs.coti.io and treat COTI as an EVM-first privacy network, not as a generic public EVM chain."
---

# COTI — EVM-first privacy network integration

Use the official COTI documentation at https://docs.coti.io/ as the source of truth before implementing any RPC, chain config, wallet, or privacy flow. COTI is an EVM-first privacy network, so architecture and implementation details must be validated against the official docs and the network’s current EVM-compatible model instead of generic blockchain assumptions.

## Core principle

- Treat COTI as an EVM-first privacy network, not as a generic L1/L2 chain.
- Prefer docs.coti.io for protocol architecture, wallet behavior, gas/token handling, network definitions, and privacy features.
- Validate any EVM integration against COTI’s actual chain configuration and contract tooling before shipping.
- When a request mixes privacy features with standard EVM patterns, follow the official COTI guidance first and only then adapt to the app’s implementation.
- COTI V2 is a Layer 2 over Ethereum designed for private computation, not just a transparent EVM deployment.

## What makes COTI different from a normal EVM

The official docs describe COTI as a blockchain designed to enable computation on encrypted data through Garbled Circuits and Multi-Party Computation (MPC). In practical terms:

- COTI is EVM-compatible, but privacy is part of the protocol design, not an afterthought.
- Private token and data flows can keep balances and transfer amounts encrypted rather than fully visible on-chain.
- Some privacy features rely on cryptographic primitives and local decryption rather than ordinary transparent state reads.
- The COTI docs explicitly mention the `MpcCore` precompile at address `0x64` as part of the privacy execution model.
- The docs also highlight `PrivateERC20` patterns where balances and amounts live as ciphertexts and decryption happens locally via the COTI wallet flow.

## Account and key creation guidance

COTI account setup and key handling are a separate concern from chain RPC configuration and should be checked in the official COTI wallet docs before building any wallet or account flow.

When the task involves creating or managing COTI accounts, keys, or wallet credentials:

- Start from the official COTI wallet/account docs, not generic Ethereum wallet assumptions.
- Treat private keys, mnemonics, and wallet secrets as high-risk material and never commit them to source control.
- Distinguish between creating a wallet account, importing an existing account, and exporting a key or recovery phrase.
- Confirm the exact wallet flow COTI currently expects before writing an onboarding or restore flow.
- If the app is doing wallet bootstrap, use secure environment variable storage and encryption patterns instead of embedding raw keys.
- If a flow depends on local decryption, privacy keys, or encrypted balance handling, validate that against the COTI docs before building the UI.

For a repo like this one, the key rule is simple: account creation is part of the COTI integration, but it must follow the COTI wallet docs and the project’s secure key-storage patterns.

## What to check first

Before writing contracts, wallet logic, backend RPC code, or frontend integration:

1. Confirm whether the task is about the COTI network, COTI V2, or the EVM-compatible environment.
2. Check the official COTI docs for the current network and environment setup.
3. Verify whether the flow depends on standard EVM transaction semantics or privacy-specific behavior.
4. Confirm token, gas, and wallet assumptions against the current COTI docs instead of memory or community posts.

## Primary network facts

COTI network values from the official documentation:

Mainnet:
- Network name: COTI
- Chain ID: 2632500
- RPC URL: https://mainnet.coti.io/rpc
- WebSocket URL: wss://mainnet.coti.io/ws
- Native currency: COTI
- Block explorer: https://mainnet.cotiscan.io

Testnet:
- Network name: COTI Testnet
- Chain ID: 7082400
- RPC URL: https://testnet.coti.io/rpc
- WebSocket URL: wss://testnet.coti.io/ws
- Native currency: COTI
- Block explorer: https://testnet.cotiscan.io

Use these values exactly when building wallet or RPC config. Do not assume generic Ethereum defaults.

## Privacy on Demand: the key COTI-specific design model

The docs explicitly describe Privacy on Demand (PoD) as a way to keep sensitive data and computation private on COTI while still using ordinary EVM chains for accounts, assets, and workflow coordination.

In practice:

- Your app can keep host EVM contracts for coordination, tokens, workflow logic, and user-facing state.
- Sensitive inputs are encrypted and sent to COTI for private computation.
- Results come back asynchronously and are decrypted locally by the user or consuming app.
- The flow is intentionally asynchronous, with pending/completed/failed states that must be modeled in the UX.
- The COTI docs call out Inbox, MPC executor, PodUser, and PodLib as key architecture components.

This means a COTI integration is not “just add a chain to MetaMask.” It often requires handling encrypted payloads, privacy-aware tx orchestration, and async result processing.

## Custom chain config for viem / wagmi

Use a custom viem chain object instead of relying on a standard generic EVM chain. Example:

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

Then wire this into a wagmi/RainbowKit config and any chain selection logic by using COTI-specific metadata rather than assuming a base Ethereum chain.

## How COTI differs from a generic public EVM

COTI is EVM-first, but not just “another Ethereum-like chain”:

- Privacy and confidential computation are first-class concerns.
- Many flows are built around COTI-specific privacy/PoD patterns rather than ordinary public-state transaction logic.
- Some integrations are asynchronous or require COTI SDKs, contract patterns, or privacy orchestration layers.
- Wallet, RPC, and explorer metadata must come from official COTI docs, not a generic chain registry.
- Fees and execution assumptions should be checked against COTI docs rather than inherited from a public L1/L2 mental model.

## When to use this skill

Use this skill when the task involves any of the following:

- adding COTI as a supported EVM network in a wallet or frontend
- integrating COTI RPC, explorer, or chain metadata into viem/wagmi/RainbowKit
- designing a hybrid app that keeps ordinary EVM coordination logic while moving sensitive logic to COTI
- implementing privacy-sensitive flows or privacy-on-demand patterns
- checking whether a feature is standard EVM behavior or COTI-specific privacy behavior

Do not use this skill for generic Ethereum-only work unless the task explicitly includes COTI or COTI privacy features.

## Rule of thumb: direct COTI vs hybrid PoD

Use a direct COTI EVM integration when:

- the app is simply connecting to a COTI chain and reading/writing standard EVM state
- chain config, explorer setup, wallet connect, and RPC wiring are the main task

Use the COTI privacy-aware flow when:

- sensitive data or computation must remain private
- the app needs encrypted inputs, async callbacks, or local decryption
- the design includes host EVM contracts plus COTI privacy processing

If you cannot tell which model applies, start from the official docs and confirm whether the flow is standard EVM coordination or a PoD privacy flow.

## Local dev vs COTI real network

A local Scaffold-ETH / Hardhat chain is useful for app plumbing, frontend wiring, and local UI iteration, but it is not the same as a real COTI environment for privacy testing.

The COTI docs make this distinction clear:

- local EVM chains are suitable for local app development and wallet UX testing
- COTI mainnet/testnet is the environment for COTI-native protocol behavior, privacy flows, and network-specific validation
- if the feature depends on real COTI privacy execution, target COTI testnet first rather than trying to fake it on localhost

In other words, a Hardhat localhost chain can be the host-side app sandbox, but real COTI privacy testing should happen against COTI testnet unless the docs explicitly say otherwise.

## Implementation guidance

### Smart contracts and EVM integrations

- COTI is EVM-first, so standard Solidity and EVM tooling may apply, but privacy features and network specifics still need official validation.
- Use the repo’s Scaffold-ETH patterns for contract hooks and frontend reads/writes when building dApps against COTI-compatible contracts.
- Do not assume gas, wallet UX, or chain behavior matches Ethereum mainnet or other EVM chains without checking COTI docs.
- For deployment and network config, confirm the target chain RPC, explorer, and chain IDs from the official setup docs before updating config files.
- If the project involves privacy-sensitive values, check whether you are building on the host EVM chain, on COTI itself, or in a hybrid PoD pattern.

### Privacy-aware product design

- Distinguish between standard onchain UX and privacy-preserving flows.
- If a feature involves confidential or privacy-sensitive transactions, validate the expected behavior with official COTI docs before designing the user experience.
- Avoid overpromising privacy guarantees unless the docs explicitly support the specific flow being implemented.

### Frontend and wallet behavior

- Check whether wallet injection, RPC setup, and chain metadata should use COTI-specific values.
- Validate transaction signing, connect flows, and network switching against the official docs and wallet provider requirements.
- Use clear user-facing messaging when transaction semantics differ from standard Ethereum behavior.
- For privacy flows, design the UI to handle pending, decryption, and callback states instead of assuming a single synchronous transaction result.
- Be careful with metadata leakage: the docs explicitly note that even with PoD, timing, gas, and linkage can still reveal information if not designed carefully.

## Practical integration checklist

- Confirm the correct COTI network (mainnet vs testnet) from docs.coti.io.
- Use the official RPC/WS URLs and correct chain IDs.
- Treat COTI as a privacy-aware EVM environment, not a plain transparent chain.
- Decide whether the app is using a direct COTI EVM integration or a hybrid host EVM + PoD model.
- If privacy is involved, model encrypted inputs, async callbacks, and local decryption in the UX.
- Prefer official COTI docs and the COTI SDK references over community assumptions.

## Contract verification guidance

After deployment, verification should be treated as a chain- and artifact-matching task, not just a source-code upload. Use the official COTI explorer or verification flow for the chosen network and match the deployed contract to the correct environment.

### Before verifying

- Confirm the deployed contract is on the intended COTI network: mainnet or testnet.
- Make sure you are not accidentally verifying a local Hardhat or localhost deployment.
- Keep the compiler version, optimization settings, and source tree consistent with the deployed artifact.
- If you deployed through a script or factory, confirm the deployed address and the actual bytecode being verified.

### Verification checklist

1. Determine the exact target network.
   - COTI mainnet: chain ID 2632500
   - COTI testnet: chain ID 7082400
2. Get the deployed contract address from the actual transaction receipt.
3. Confirm the explorer is the correct COTI explorer for that network.
4. Rebuild with the exact Solidity compiler version used for deployment.
5. Verify that the constructor arguments, optimizer settings, and source layout match the deployed artifact.
6. Check the bytecode hash against the deployed contract if the verification is failing or appears mismatched.

### Common failure modes

- Verifying a localhost contract on the wrong COTI explorer.
- Checking the wrong chain in the wallet or block explorer because the app is running on a local chain.
- Using a different compiler version than the one used to deploy.
- Forgetting constructor arguments or optimizer settings.
- Mixing a PoD/host-chain deployment with a COTI private flow while verifying the wrong environment.

### Verification rule for this repo

For a Scaffold-ETH app, local verification is useful for the app shell and basic deploy flow, but real COTI contract verification should happen on the COTI network that actually hosts the deployment. If the feature is COTI-specific or privacy-related, validate against COTI testnet first before assuming a local dev deployment is equivalent.

## Project-specific notes for this repo

This repo is a Scaffold-ETH 2 app. For COTI work in this codebase:

- Keep the frontend aligned with the repo’s existing Scaffold-ETH hooks and patterns.
- Prefer the project’s established web3 conventions instead of ad hoc wallet logic.
- Add or update network config only after confirming the official COTI chain details.
- Treat COTI docs as the authoritative source for network and privacy compatibility, not a generic “EVM is EVM” assumption.

## Do / Don’t checklist

Do:
- validate chain metadata from official docs before editing wallet config
- model async privacy workflows as pending callback flows
- treat COTI as a privacy-aware EVM environment
- distinguish host EVM logic from COTI privacy logic

Don’t:
- assume COTI behaves exactly like plain Ethereum without checking docs
- treat PoD as a normal synchronous EVM transaction
- assume gas, explorer, or wallet behavior matches standard public EVM chains
- assume privacy guarantees without checking the actual COTI docs for the specific flow

## Safety reminders

- Never commit private keys, provider secrets, or wallet credentials.
- Validate chain metadata and RPC endpoints against authoritative documentation before deployment.
- Do not assume Ethereum behavior transfers unchanged to COTI without checking the docs.
- When docs are unclear or a feature crosses privacy and EVM boundaries, pause and confirm against docs.coti.io before making product or protocol claims.
