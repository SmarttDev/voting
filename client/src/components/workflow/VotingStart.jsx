import { useContext } from "react";
import Web3Context from "context/Web3Context";

const VotingStart = () => {
  const { contract, accounts, setWorkflow, owner } = useContext(Web3Context);

  contract.events
    .WorkflowStatusChange()
    .on("data", async (event) => {
      setWorkflow(event.returnValues.newStatus);
    })
    .on("error", console.error);

  return (
    <>
      <div className="flex justify-center space-x-4 mt-20">
        {owner === accounts[0] && (
          <button
            type="submit"
            onClick={async () =>
              await contract.methods.VoteEnd().send({ from: accounts[0] })
            }
            className="px-8 rounded-lg bg-red-600 text-white font-bold p-4 uppercase border-red-600 border-t border-b border-r"
          >
            Clôturer les votes
          </button>
        )}
      </div>
    </>
  );
};

export default VotingStart;
