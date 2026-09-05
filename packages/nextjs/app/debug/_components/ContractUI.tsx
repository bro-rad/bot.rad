"use client";

// @refresh reset
import { useMemo, useReducer } from "react";
// The package does not export declarations for these reusable internal panels.
// @ts-expect-error The runtime modules are shipped but omitted from the package export map.
import { ContractReadMethods } from "../../../node_modules/@scaffold-ui/debug-contracts/dist/esm/components/ContractReadMethods.js";
// @ts-expect-error The runtime modules are shipped but omitted from the package export map.
import { ContractVariables } from "../../../node_modules/@scaffold-ui/debug-contracts/dist/esm/components/ContractVariables.js";
// @ts-expect-error The runtime modules are shipped but omitted from the package export map.
import { ContractWriteMethods } from "../../../node_modules/@scaffold-ui/debug-contracts/dist/esm/components/ContractWriteMethods.js";
import { Address, Balance } from "@scaffold-ui/components";
import { Contract, ContractConfigProvider } from "@scaffold-ui/debug-contracts";
import { Toaster } from "react-hot-toast";
import { Chain } from "viem";
import { useDeployedContractInfo } from "~~/hooks/scaffold-eth";
import { useTargetNetwork } from "~~/hooks/scaffold-eth/useTargetNetwork";
import scaffoldConfig from "~~/scaffold.config";
import { ContractName } from "~~/utils/scaffold-eth/contract";

type ContractUIProps = {
  contractName: ContractName;
  className?: string;
};

const CotiContract = ({
  contractName,
  contract,
  chain,
}: {
  contractName: string;
  contract: { address: `0x${string}`; abi: readonly any[] };
  chain: Chain;
}) => {
  const [refreshDisplayVariables, triggerRefreshDisplayVariables] = useReducer(value => !value, false);
  const balanceStyle = useMemo(() => ({ fontSize: "0.75rem" }), []);
  const explorerBaseUrl = chain.blockExplorers?.default?.url;
  const resolveAddressLink = (address: string) =>
    explorerBaseUrl ? `${explorerBaseUrl}/address/${address}` : undefined;

  return (
    <ContractConfigProvider config={{ chain, chainId: chain.id, resolveAddressLink }}>
      <div className="grid w-full max-w-7xl grid-cols-1 px-6 font-sans lg:grid-cols-6 lg:gap-12 lg:px-10">
        <div className="col-span-5 grid grid-cols-1 gap-8 lg:grid-cols-3 lg:gap-10">
          <div className="col-span-1 flex flex-col">
            <div className="border border-base-300 bg-base-100 px-6 py-4 shadow-md lg:px-8">
              <div className="flex flex-col gap-1">
                <span className="font-bold">{contractName}</span>
                <Address
                  address={contract.address}
                  onlyEnsOrAddress
                  size="base"
                  chain={chain}
                  blockExplorerAddressLink={resolveAddressLink(contract.address)}
                />
                <div className="mt-1 flex items-center gap-1">
                  <span className="text-sm font-bold">Balance:</span>
                  <Balance address={contract.address} style={balanceStyle} />
                </div>
                <p className="my-0 text-sm">
                  <span className="font-bold">Network</span>: {chain.name}
                </p>
              </div>
            </div>
            <div className="overflow-y-auto bg-base-200 px-6 py-4 lg:px-8">
              <ContractVariables refreshDisplayVariables={refreshDisplayVariables} contract={contract} />
            </div>
          </div>
          <div className="col-span-1 flex flex-col gap-6 lg:col-span-2">
            <ContractReadMethods contract={contract} />
            <ContractWriteMethods onChange={triggerRefreshDisplayVariables} contract={contract} />
          </div>
        </div>
      </div>
      <Toaster />
    </ContractConfigProvider>
  );
};

/**
 * UI component to interface with deployed contracts.
 **/
export const ContractUI = ({ contractName }: ContractUIProps) => {
  const { targetNetwork } = useTargetNetwork();
  const fallbackChainId = scaffoldConfig.targetNetworks[0]?.id ?? 1;
  const safeTargetNetworkName = targetNetwork?.name ?? "COTI Testnet";
  const safeChainId = targetNetwork?.id ?? fallbackChainId;
  const { data: deployedContractData, isLoading: deployedContractLoading } = useDeployedContractInfo({ contractName });

  if (deployedContractLoading) {
    return (
      <div className="mt-14">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (!deployedContractData) {
    return (
      <p className="text-3xl mt-14">
        No contract found by the name of {contractName} on chain {safeTargetNetworkName}!
      </p>
    );
  }

  if (safeChainId === 7082400 || safeChainId === 2632500) {
    return <CotiContract contractName={contractName} contract={deployedContractData} chain={targetNetwork} />;
  }

  return <Contract contractName={contractName as string} contract={deployedContractData} chainId={safeChainId} />;
};
