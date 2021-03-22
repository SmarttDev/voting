import { useContext, useState } from "react";
import Web3Context from "context/Web3Context";
import ProposalList from "components/ProposalList";
import { Forbidden } from "components/workflow";
import Modal from "components/Modal";
import VotersAddress from "components/VotersAddress";

const VotingEnd = () => {
  const { contract, accounts, setWorkflow, owner, votersAddress } = useContext(
    Web3Context
  );
  const [showModal, setShowModal] = useState(false);

  contract.events
    .WorkflowStatusChange()
    .on("data", async (event) => {
      setWorkflow(event.returnValues.newStatus);
    })
    .on("error", console.error);

  return (
    <>
      {votersAddress.indexOf(accounts[0]) === -1 ? (
        <div>
          <Forbidden content="Vous n'êtes pas autorisé à voter." />
          <div>
            <span className="text-indigo-600">
              Veuillez utiliser une adresse qui fait partie de la liste des
              adresses autorisées
            </span>
          </div>
        </div>
      ) : (
        <div>
          <ProposalList />
          <div className="flex justify-center space-x-4 mt-20">
            {owner === accounts[0] && (
              <>
                <button
                  type="button"
                  onClick={() => setShowModal(true)}
                  className="px-8 rounded-lg bg-green-600 text-white font-bold p-4 uppercase border-green-600 border-t border-b border-r"
                  style={{ transition: "all .15s ease" }}
                >
                  Voir la whitelist
                </button>

                <button
                  type="button"
                  onClick={async () =>
                    await contract.methods
                      .WinningProposal()
                      .send({ from: accounts[0] })
                  }
                  className="px-8 rounded-lg bg-red-600 text-white font-bold p-4 uppercase border-red-600 border-t border-b border-r"
                >
                  Comptabiliser les votes
                </button>
                {showModal && (
                  <Modal
                    content={<VotersAddress content={votersAddress} />}
                    title="Liste des votants"
                    setShowModal={setShowModal}
                  />
                )}
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default VotingEnd;
