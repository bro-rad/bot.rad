import { Address, parseEther } from "viem";
import { useScaffoldContractWrite } from "~~/hooks/scaffold-eth";

export const Cast = ({ wei, to, script, refresh }: { wei: string; to: Address; script: any; refresh: any }) => {
  const { writeAsync, isMining } = useScaffoldContractWrite({
    contractName: "ScribeCast",
    functionName: "cast",
    args: [to, script],
    value: parseEther(wei),
    blockConfirmations: 1,
    onBlockConfirmation: () => {
      refresh();
    },
  });

  return (
    <>
      <div>
        <div>
          <button className="btn btn-accent" disabled={isMining} onClick={() => writeAsync()}>
            {isMining ? "CASTING..." : "CAST (call;)"}
          </button>
        </div>
      </div>
    </>
  );
};
export default Cast;
