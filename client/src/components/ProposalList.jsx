import { useContext } from "react";
import Web3Context from "context/Web3Context";
import WorkflowStatus from "workflowStatus";

const ProposalList = ({ content, winnerProposal }) => {
  const { contract, accounts, workflow, voter, proposalList } = useContext(
    Web3Context
  );

  return (
    <>
      <div>
        {workflow < WorkflowStatus.indexOf("VotingSessionStarted") && (
          <span className="text-red-600">
            Les votes ne sont pas encore ouverts
          </span>
        )}
        {parseInt(workflow) ===
          WorkflowStatus.indexOf("VotingSessionEnded") && (
          <span className="text-red-600">Les votes sont clôs</span>
        )}
        {parseInt(workflow) === WorkflowStatus.indexOf("VotesTallied") && (
          <h1 className="text-yellow-600">
            {`La proposition gagnante est : ${winnerProposal?.description} avec ${winnerProposal?.voteCount} vote(s)`}
          </h1>
        )}
        {voter.hasVoted &&
          WorkflowStatus[workflow] === "VotingSessionStarted" && (
            <span className="text-red-600">
              Votre vote à bien été enregistré.
            </span>
          )}
      </div>
      <div className="w-full">
        <div className="bg-white shadow-md rounded my-6">
          <table className="min-w-max w-full table-auto">
            <thead>
              <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-left">ID</th>
                <th className="py-3 px-6 text-left">Proposition</th>
                {WorkflowStatus[workflow] === "VotingSessionStarted" && (
                  <th className="py-3 px-6 text-center">
                    {voter.hasVoted ? "" : "Actions"}
                  </th>
                )}
                {workflow >= WorkflowStatus.indexOf("VotingSessionEnd") && (
                  <th className="py-3 px-6 text-center">Résultats</th>
                )}
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm font-light">
              {proposalList.map((p, index) => {
                let selection =
                  voter.hasVoted &&
                  index === parseInt(voter.votedProposalId) &&
                  WorkflowStatus[workflow] === "VotingSessionStarted"
                    ? "bg-green-100"
                    : WorkflowStatus[workflow] === "VotesTallied" &&
                      winnerProposal &&
                      winnerProposal["description"] === p.description
                    ? "bg-yellow-200"
                    : "";

                return (
                  <tr
                    key={index}
                    className={`
                      ${selection}
                      border-b border-gray-200 hover:bg-gray-100`}
                  >
                    <td className="py-3 px-6 text-left whitespace-nowrap">
                      <span className="font-medium">{index}</span>
                    </td>
                    <td className="py-3 px-6 text-left">
                      <span>{p.description}</span>
                    </td>
                    {WorkflowStatus[workflow] === "VotingSessionStarted" && (
                      <td className="py-3 px-6 text-center">
                        <div className="flex item-center justify-center">
                          {!voter.hasVoted && (
                            <button
                              type="button"
                              className="bg-green-600 text-white py-1 px-3 rounded-md text-xs"
                              onClick={async () =>
                                await contract.methods
                                  .AddVote(index)
                                  .send({ from: accounts[0] })
                              }
                            >
                              Voter
                            </button>
                          )}
                        </div>
                      </td>
                    )}
                    {workflow >= WorkflowStatus.indexOf("VotingSessionEnd") && (
                      <td className="py-3 px-6 text-center">
                        <div className="flex item-center justify-center">
                          {p.voteCount}
                        </div>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default ProposalList;
