import { useState } from "react";
import Modal from "components/Modal";

const ProposalStart = ({ owner, contract, accounts }) => {
  const [showModal, setShowModal] = useState(false);
  const submitRegisterProposal = async (e) => {
    // Stores a given value, 5 by default.
    await contract.methods
      .RegisterProposal(e.target.proposal.value)
      .send({ from: accounts[0] }, async (error, tx) => {
        if (tx) {
          e.target.reset();
        }
      });
  };

  const modalTitle = "Title proposal";
  const modalContent = "Modal content proposal";

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

      {showModal && <Modal content={modalContent} title={modalTitle} />}
    </>
  );
};

export default ProposalStart;
