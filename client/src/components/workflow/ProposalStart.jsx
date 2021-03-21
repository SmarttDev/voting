import { useState, useEffect, useContext } from "react";
import Web3Context from "context/Web3Context";
import Modal from "components/Modal";
import Proposal from "components/Proposal";

const ProposalStart = () => {
  const { contract, accounts, setWorkflow, owner } = useContext(Web3Context);
  const [showModal, setShowModal] = useState(false);
  const [proposal, setProposal] = useState([]);

  contract.events
    .ProposalRegistered()
    .on("data", async (event) => {
      console.log(event.returnValues);
    })
    .on("error", console.error);

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

  const submitRegisterProposal = async (e) => {
    e.preventDefault();

    const newProposal = e.target.proposal.value;
    await contract.methods
      .RegisterProposal(newProposal)
      .send({ from: accounts[0] }, async (error, tx) => {
        if (tx) {
          e.target.reset();
          setProposal([...proposal, newProposal]);
        }
        if (error) {
          console.log(error);
        }
      });
  };

  return (
    <>
      <p className="text-indigo-600 font-bold">
        Période d'enregistrement des propositions
      </p>
      <form className="mt-6" onSubmit={submitRegisterProposal}>
        <input
          id="proposal"
          type="text"
          className="w-9/12 rounded-l-lg p-4 border-t mr-0 border-b border-l text-gray-800 border-gray-200 bg-white"
          placeholder="Ajouter votre proposition"
          required
        />
        <button
          type="submit"
          className="px-8 rounded-r-lg bg-indigo-600 text-white font-bold p-4 uppercase border-indigo-600 border-t border-b border-r"
        >
          Valider
        </button>
      </form>

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
              await contract.methods.ProposalEnd().send({ from: accounts[0] })
            }
            className="px-8 rounded-lg bg-red-600 text-white font-bold p-4 uppercase border-red-600 border-t border-b border-r"
          >
            Clôturer les propositions
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

export default ProposalStart;
