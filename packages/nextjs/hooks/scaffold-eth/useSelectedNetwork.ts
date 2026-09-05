import scaffoldConfig from "~~/scaffold.config";
import { useGlobalState } from "~~/services/store/store";
import { AllowedChainIds } from "~~/utils/scaffold-eth";
import { ChainWithAttributes, NETWORKS_EXTRA_DATA } from "~~/utils/scaffold-eth/networks";

const getFallbackTargetNetwork = (): ChainWithAttributes => {
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
 * Given a chainId, retrives the network object from `scaffold.config`,
 * if not found default to network set by `useTargetNetwork` hook
 */
export function useSelectedNetwork(chainId?: AllowedChainIds): ChainWithAttributes {
  const globalTargetNetwork = useGlobalState(({ targetNetwork }) => targetNetwork) ?? getFallbackTargetNetwork();
  const targetNetwork = scaffoldConfig.targetNetworks.find(targetNetwork => targetNetwork.id === chainId);

  if (targetNetwork) {
    return { ...targetNetwork, ...NETWORKS_EXTRA_DATA[targetNetwork.id] };
  }

  return globalTargetNetwork ?? getFallbackTargetNetwork();
}
