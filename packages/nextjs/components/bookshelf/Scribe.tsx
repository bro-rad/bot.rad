import { useScaffoldContractWrite } from "../../hooks/scaffold-eth/";
import { Address, keccak256, parseEther, toBytes } from "viem";

export const Scribe = ({ to, script, refresh }: { to: Address; script: any; refresh: any }) => {
  const { writeAsync, isMining } = useScaffoldContractWrite({
    contractName: "ScribeCast",
    functionName: "scribe",
    args: [to, keccak256(toBytes(script))],
    value: parseEther("0"),
    blockConfirmations: 1,
    onBlockConfirmation: () => {
      refresh();
    },
  });

  return (
    <>
      <div>
        <div>
          <button className="btn btn-info" disabled={isMining} onClick={() => writeAsync()}>
            {isMining ? "COMMITTING..." : "SCRIBE COMMITMENT"}
          </button>
        </div>
      </div>
    </>
  );
};
export default Scribe;
