import { useEffect, useMemo } from "react";
import { useAccount } from "wagmi";
import scaffoldConfig from "~~/scaffold.config";
import { useGlobalState } from "~~/services/store/store";
import { ChainWithAttributes } from "~~/utils/scaffold-eth";
import { NETWORKS_EXTRA_DATA } from "~~/utils/scaffold-eth";

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
 * Retrieves the connected wallet's network from scaffold.config or defaults to the 0th network in the list if the wallet is not connected.
 */
export function useTargetNetwork(): { targetNetwork: ChainWithAttributes } {
  const { chain } = useAccount();
  const targetNetwork = useGlobalState(({ targetNetwork }) => targetNetwork) ?? getDefaultTargetNetwork();
  const setTargetNetwork = useGlobalState(({ setTargetNetwork }) => setTargetNetwork);

  useEffect(() => {
    const fallbackTargetNetwork = getDefaultTargetNetwork();
    const activeTargetNetwork = targetNetwork ?? fallbackTargetNetwork;

    const newSelectedNetwork = scaffoldConfig.targetNetworks.find(targetNetwork => targetNetwork.id === chain?.id);
    if (newSelectedNetwork && newSelectedNetwork.id !== activeTargetNetwork.id) {
      setTargetNetwork({ ...newSelectedNetwork, ...NETWORKS_EXTRA_DATA[newSelectedNetwork.id] });
    }
  }, [chain?.id, setTargetNetwork, targetNetwork]);

  return useMemo(() => ({ targetNetwork: targetNetwork ?? getDefaultTargetNetwork() }), [targetNetwork]);
}
