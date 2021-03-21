import { useState, useEffect, useContext } from "react";
import Web3Context from "context/Web3Context";
import Modal from "components/Modal";
import Proposal from "components/Proposal";

const ProposalEnd = () => {
  const { contract, accounts, setWorkflow, owner } = useContext(Web3Context);
  const [showModal, setShowModal] = useState(false);
  const [proposal, setProposal] = useState([]);

  contract.events
    .WorkflowStatusChange()
    .on("data", async (event) => {
      setWorkflow(event.returnValues.newStatus);
    })
    .on("error", console.error);

  useEffect(() => {
    (async () => {
      try {
        setProposal([1, 2]);
      } catch (error) {
        // Catch any errors for any of the above operations.
        alert(
          `Failed to load web3, accounts, or contract. Check console for details.`
        );
        console.error(error);
      }
    })();
  }, [contract]);

  return (
    <>
      <div className="flex justify-center space-x-4 mt-20">
        {owner === accounts[0] && (
          <button
            type="submit"
            onClick={() => setShowModal(true)}
            className="px-8 rounded-lg bg-green-600 text-white font-bold p-4 uppercase border-green-600 border-t border-b border-r"
          >
            Voir les propositions
          </button>
        )}
        {owner === accounts[0] && (
          <button
            type="submit"
            onClick={async () =>
              await contract.methods.VoteStart().send({ from: accounts[0] })
            }
            className="px-8 rounded-lg bg-red-600 text-white font-bold p-4 uppercase border-red-600 border-t border-b border-r"
          >
            Démarrer les votes
          </button>
        )}
      </div>

      {showModal && (
        <Modal
          content={<Proposal content={proposal} />}
          title="Liste des propositions"
          setShowModal={setShowModal}
        />
      )}
    </>
  );
};

export default ProposalEnd;
