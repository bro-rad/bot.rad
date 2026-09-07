import { defineChain } from "viem";
import * as chains from "viem/chains";

export const cotiMainnet = defineChain({
  id: 2_632_500,
  name: "COTI",
  network: "coti",
  nativeCurrency: { name: "COTI", symbol: "COTI", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://mainnet.coti.io/rpc"], webSocket: ["wss://mainnet.coti.io/ws"] },
    public: { http: ["https://mainnet.coti.io/rpc"], webSocket: ["wss://mainnet.coti.io/ws"] },
  },
  blockExplorers: { default: { name: "COTIScan", url: "https://mainnet.cotiscan.io" } },
});

export const cotiTestnet = defineChain({
  id: 7_082_400,
  name: "COTI Testnet",
  network: "cotiTestnet",
  nativeCurrency: { name: "COTI", symbol: "COTI", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://testnet.coti.io/rpc"], webSocket: ["wss://testnet.coti.io/ws"] },
    public: { http: ["https://testnet.coti.io/rpc"], webSocket: ["wss://testnet.coti.io/ws"] },
  },
  blockExplorers: { default: { name: "COTIScan Testnet", url: "https://testnet.cotiscan.io" } },
  testnet: true,
});

export type ScaffoldConfig = {
  targetNetworks: readonly chains.Chain[];
  pollingInterval: number;
  alchemyApiKey: string;
  walletConnectProjectId: string;
  onlyLocalBurnerWallet: boolean;
  walletAutoConnect: boolean;
};

const scaffoldConfig = {
  // The networks on which your DApp is live
  // Add cotiTestnet/cotiMainnet after ScribeCast is deployed and its ABI/address is generated.
  targetNetworks: [chains.gnosis, chains.gnosisChiado, chains.mainnet, chains.hardhat],

  // The interval at which your front-end polls the RPC servers for new data
  // it has no effect if you only target the local network (default is 4000)
  pollingInterval: 30000,

  // This is ours Alchemy's default API key.
  // You can get your own at https://dashboard.alchemyapi.io
  // It's recommended to store it in an env variable:
  // .env.local for local testing, and in the Vercel/system env config for live apps.
  alchemyApiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY || "oKxs-03sij-U_N0iOlrSsZFr29-IqbuF",

  // This is ours WalletConnect's default project ID.
  // You can get your own at https://cloud.walletconnect.com
  // It's recommended to store it in an env variable:
  // .env.local for local testing, and in the Vercel/system env config for live apps.
  walletConnectProjectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || "3a8170812b534d0ff9d794f19a901d64",

  // Only show the Burner Wallet when running on hardhat network
  onlyLocalBurnerWallet: false,

  /**
   * Auto connect:
   * 1. If the user was connected into a wallet before, on page reload reconnect automatically
   * 2. If user is not connected to any wallet:  On reload, connect to burner wallet if burnerWallet.enabled is true && burnerWallet.onlyLocal is false
   */
  walletAutoConnect: true,
} as const satisfies ScaffoldConfig;

export default scaffoldConfig;
