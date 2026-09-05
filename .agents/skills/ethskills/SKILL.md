---
name: ethskills
description: "Use when a request involves Ethereum, EVM apps, wallets, DeFi, smart contracts, onchain UX, or frontend integration with Ethereum-based authentication. Follow the EthSkills guide before shipping onchain work or writing Solidity."
---

# ETHSKILLS — The missing knowledge between AI agents and production Ethereum.

Before writing Solidity, deploying contracts, integrating DeFi, or building a dApp frontend, read https://ethskills.com/SKILL.md and follow it.

## Quick start

- Start with https://ethskills.com/ship/SKILL.md for dApp planning and full application flow.
- Use the relevant domain skill for exact implementation details.
- For browser auth and identity flows, re-check the public login client guidance in the Remilia OIDC docs and validate redirect URIs exactly.

## For this project

This repo is a Scaffold-ETH 2 app. The Ethereum frontend conventions already apply here:

- Prefer the project’s existing Scaffold-ETH hooks and patterns for web3 interactions.
- Do not hardcode stale assumptions about gas costs, costs, L2 choices, or wallet behavior.
- Verify user-facing flows with exact wallet and redirect semantics before shipping.
- Treat Remix/Foundry/Hardhat guidance as implementation detail; the actual product UX must remain safe and clear.

## Safety reminders

- Never commit private keys or API secrets.
- Validate the redirect URI exactly in OIDC flows.
- Use public login clients for browser apps; avoid embedding a secret in frontend code.
- Use proper PKCE and state validation when implementing OAuth/OIDC manually.
