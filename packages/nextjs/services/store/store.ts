import { create } from "zustand";
import scaffoldConfig from "~~/scaffold.config";
import { ChainWithAttributes, NETWORKS_EXTRA_DATA } from "~~/utils/scaffold-eth";

const getDefaultTargetNetwork = (): ChainWithAttributes => {
  const firstTargetNetwork = scaffoldConfig.targetNetworks[0];

  if (!firstTargetNetwork) {
    throw new Error("No target network configured in scaffold.config.ts");
  }

  return {
    ...firstTargetNetwork,
    ...NETWORKS_EXTRA_DATA[firstTargetNetwork.id],
  };
};

/**
 * Zustand Store
 *
 * You can add global state to the app using this useGlobalState, to get & set
 * values from anywhere in the app.
 *
 * Think about it as a global useState.
 */

type GlobalState = {
  targetNetwork: ChainWithAttributes;
  setTargetNetwork: (newTargetNetwork: ChainWithAttributes) => void;
};

export const useGlobalState = create<GlobalState>(set => ({
  targetNetwork: getDefaultTargetNetwork(),
  setTargetNetwork: (newTargetNetwork: ChainWithAttributes) => set(() => ({ targetNetwork: newTargetNetwork })),
}));
