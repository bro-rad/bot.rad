# Scribe Cast on COTI
Create calldata for a target contract or publish a privacy-preserving commitment to spell data.

The COTI branch targets COTI V2 and keeps raw spell bytes out of emitted events. A commitment proves that data existed without making the data itself part of the public event log.

## COTI Networks

| Network | Chain ID | RPC | Explorer |
| --- | ---: | --- | --- |
| COTI Testnet | `7082400` | `https://testnet.coti.io/rpc` | [COTIScan Testnet](https://testnet.cotiscan.io) |
| COTI Mainnet | `2632500` | `https://mainnet.coti.io/rpc` | [COTIScan](https://mainnet.cotiscan.io) |

Use the testnet faucet at [faucet.coti.io](https://faucet.coti.io) before testing. COTI privacy is not automatic: private computation requires COTI's onboarding and encrypted data flows. Ordinary calldata and native transfers remain visible to the network.

## Deployment Information
Demo (not mobile friendly)
uri: [spellbook-psi.vercel.app](https://spellbook-psi.vercel.app)

### Chiado
`deploying "ScribeCast" (tx: 0x6b178b01d867d181f44b538e74dc13c1f31d3ebdb6d512858ac88fe20d7d5efe)...: deployed at 0xD53e01c57d6E34e3a1C24f58B4CC307D1265f0E9 with 541164 gas`
- [Chiado Verified Contract](https://gnosis-chiado.blockscout.com/address/0xD53e01c57d6E34e3a1C24f58B4CC307D1265f0E9#code)

### gnosis
`deploying "ScribeCast" (tx: 0x3b8e389844f5adff8e91fbf35df184e567a95c912e9286844366f37c823224d7)...: deployed at 0x23Ad6acb5ceFdf05DA4240843943C5b359F2AB0E with 541176 gas`
- [Gnosis Verified Contract](https://gnosisscan.io/address/0x23Ad6acb5ceFdf05DA4240843943C5b359F2AB0E#code)

### mainnet
`deploying "ScribeCast" (tx: 0x5d06262e75c313123c11f094d92df4eab44442e22abf303f36555cda3427ead4)...: deployed at 0x0B4cbCfDb14D4D162fb34850E65413E9C5fB530F with 541176 gas`
- [Mainnet Verified Contract](https://etherscan.io/address/0x0B4cbCfDb14D4D162fb34850E65413E9C5fB530F#code)

## Contract Information

- `NAME` is `ScribeCast`.
- `SYMBOL` is `SCRAISBTE`.
- `scribe` emits `keccak256(spell)` as `spellCommitment`; raw spell bytes are not emitted.
- `cast` forwards a call and value, rejects the zero address and the ScribeCast contract itself, and uses a reentrancy lock.
- Failed casts revert with `CastFailed`; the failed call does not leave a success event.

### Result Event

```solidity
event result(
    string action,
    address indexed to,
    address indexed from,
    bytes32 spellCommitment,
    bool success
);
```


# 🏗 Scaffold-ETH 2

<h4 align="center">
  <a href="https://docs.scaffoldeth.io">Documentation</a> |
  <a href="https://scaffoldeth.io">Website</a>
</h4>

🧪 An open-source, up-to-date toolkit for building decentralized applications (dapps) on the Ethereum blockchain. It's designed to make it easier for developers to create and deploy smart contracts and build user interfaces that interact with those contracts.

⚙️ Built using NextJS, RainbowKit, Hardhat, Wagmi, and Typescript.

- ✅ **Contract Hot Reload**: Your frontend auto-adapts to your smart contract as you edit it.
- 🪝 **[Custom hooks](https://docs.scaffoldeth.io/hooks/)**: Collection of React hooks wrapper around [wagmi](https://wagmi.sh/) to simplify interactions with smart contracts with typescript autocompletion.
- 🧱 [**Components**](https://docs.scaffoldeth.io/components/): Collection of common web3 components to quickly build your frontend.
- 🔥 **Burner Wallet & Local Faucet**: Quickly test your application with a burner wallet and local faucet.
- 🔐 **Integration with Wallet Providers**: Connect to different wallet providers and interact with the Ethereum network.

![Debug Contracts tab](https://github.com/scaffold-eth/scaffold-eth-2/assets/55535804/1171422a-0ce4-4203-bcd4-d2d1941d198b)

## Requirements

Before you begin, you need to install the following tools:

- [Node (v18 LTS)](https://nodejs.org/en/download/)
- Yarn ([v1](https://classic.yarnpkg.com/en/docs/install/) or [v2+](https://yarnpkg.com/getting-started/install))
- [Git](https://git-scm.com/downloads)

## Quickstart

To get started with Scaffold-ETH 2, follow the steps below:

1. Clone this repo & install dependencies

```
git clone https://github.com/scaffold-eth/scaffold-eth-2.git
cd scaffold-eth-2
yarn install
```

2. Run a local network in the first terminal:

```
yarn chain
```

This command starts a local Ethereum network using Hardhat. The network runs on your local machine and can be used for testing and development. You can customize the network configuration in `hardhat.config.ts`.

3. On a second terminal, deploy the test contract:

```
yarn deploy
```

This command deploys a test smart contract to the local network. The contract is located in `packages/hardhat/contracts` and can be modified to suit your needs. The `yarn deploy` command uses the deploy script located in `packages/hardhat/deploy` to deploy the contract to the network. You can also customize the deploy script.

4. On a third terminal, start your NextJS app:

```
yarn start
```

Visit your app on: `http://localhost:3000`. You can interact with your smart contract using the `Debug Contracts` page. You can tweak the app config in `packages/nextjs/scaffold.config.ts`.

Run smart contract test with `yarn hardhat:test`

- Edit your smart contract `ScribeCast.sol` in `packages/hardhat/contracts`
- Edit your frontend in `packages/nextjs/pages`
- Edit your deployment scripts in `packages/hardhat/deploy`

## Documentation

Visit our [docs](https://docs.scaffoldeth.io) to learn how to start building with Scaffold-ETH 2.

To know more about its features, check out our [website](https://scaffoldeth.io).

## Contributing to Scaffold-ETH 2

We welcome contributions to Scaffold-ETH 2!

Please see [CONTRIBUTING.MD](https://github.com/scaffold-eth/scaffold-eth-2/blob/main/CONTRIBUTING.md) for more information and guidelines for contributing to Scaffold-ETH 2.
