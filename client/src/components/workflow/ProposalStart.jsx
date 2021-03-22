import { useState, useContext } from "react";
import Web3Context from "context/Web3Context";
import Modal from "components/Modal";
import { Forbidden } from "components/workflow";
import ProposalList from "components/ProposalList";

const ProposalStart = () => {
  const {
    contract,
    accounts,
    owner,
    votersAddress,
    proposalList,
    setProposalList,
    setWorkflow,
  } = useContext(Web3Context);
  const [showModal, setShowModal] = useState(false);

  contract.events
    .WorkflowStatusChange()
    .on("data", async (event) => {
      setWorkflow(event.returnValues.newStatus);
    })
    .on("error", console.error);

  const submitRegisterProposal = async (e) => {
    e.preventDefault();

    const newProposal = e.target.proposal.value;
    await contract.methods
      .RegisterProposal(newProposal)
      .send({ from: accounts[0] }, async (error, tx) => {
        if (tx) {
          e.target.reset();
          setProposalList(newProposal);
        }
        if (error) {
          console.log(error);
        }
      });
  };

  return (
    <>
      {votersAddress.indexOf(accounts[0]) === -1 ? (
        <div>
          <Forbidden content="Vous n'êtes pas autorisé à enregistrer des propositions." />
          <div>
            <span className="text-indigo-600">
              Veuillez utiliser une adresse qui fait partie de la liste des
              adresses autorisées
            </span>
          </div>
        </div>
      ) : (
        <div>
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
                type="button"
                onClick={() => setShowModal(true)}
                className="px-8 rounded-lg bg-green-600 text-white font-bold p-4 uppercase border-green-600 border-t border-b border-r"
              >
                Voir les propositions
              </button>
            )}
            {owner === accounts[0] && (
              <button
                type="button"
                onClick={async () =>
                  await contract.methods
                    .ProposalEnd()
                    .send({ from: accounts[0] })
                }
                className="px-8 rounded-lg bg-red-600 text-white font-bold p-4 uppercase border-red-600 border-t border-b border-r"
              >
                Clôturer les propositions
              </button>
            )}
          </div>

          {showModal && (
            <Modal
              content={<ProposalList content={proposalList} />}
              title="Liste des propositions"
              setShowModal={setShowModal}
            />
          )}
        </div>
      )}
    </>
  );
};

export default ProposalStart;
