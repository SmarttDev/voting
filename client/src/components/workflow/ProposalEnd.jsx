import { useState, useContext } from "react";
import Web3Context from "context/Web3Context";
import Modal from "components/Modal";
import Proposal from "components/Proposal";

const ProposalEnd = () => {
  const { contract, accounts, setWorkflow, owner, proposalList } = useContext(
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
      <div className="w-full">
        <div className="bg-white shadow-md rounded my-6">
          <table className="min-w-max w-full table-auto">
            <thead>
              <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-left">ID</th>
                <th className="py-3 px-6 text-left">Proposition</th>
                <th className="py-3 px-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm font-light">
              {proposalList.map((p, index) => (
                <tr
                  key={index}
                  className="border-b border-gray-200 hover:bg-gray-100"
                >
                  <td className="py-3 px-6 text-left whitespace-nowrap">
                    <span className="font-medium">{index}</span>
                  </td>
                  <td className="py-3 px-6 text-left">
                    <span>{p.description}</span>
                  </td>
                  <td className="py-3 px-6 text-center">
                    <div className="flex item-center justify-center">
                      <button className="bg-green-600 text-white py-1 px-3 rounded-md text-xs">
                        Voter
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="flex justify-center space-x-4 mt-20">
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
          content={<Proposal content={proposalList} />}
          title="Liste des propositions"
          setShowModal={setShowModal}
        />
      )}
    </>
  );
};

export default ProposalEnd;
