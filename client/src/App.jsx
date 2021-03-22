import React, { useContext } from "react";
import Web3Context from "context/Web3Context";
import {
  RegisteringVoters,
  ProposalStart,
  ProposalEnd,
  VotingStart,
  VotingEnd,
  VotesTallied,
} from "components/workflow";
import WorkflowStatus from "workflowStatus";

function App() {
  const { web3, accounts, workflow } = useContext(Web3Context);

  const componentWorkflow = (param) => {
    switch (param) {
      case "RegisteringVoters":
        return <RegisteringVoters />;
      case "ProposalsRegistrationStarted":
        return <ProposalStart />;
      case "ProposalsRegistrationEnded":
        return <ProposalEnd />;
      case "VotingSessionStarted":
        return <VotingStart />;
      case "VotingSessionEnded":
        return <VotingEnd />;
      case "VotesTallied":
        return <VotesTallied />;
      default:
        <></>;
    }
  };

  return (
    <div>
      {web3 ? (
        <>
          <section className="text-center bg-white">
            <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl mb-20">
              Voting Dapp
            </h1>
            <div className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-3xl sm:mx-auto md:mt-5 md:text-xl">
              {accounts.length ? (
                componentWorkflow(WorkflowStatus[workflow])
              ) : (
                <p className="text-indigo-600 font-bold">
                  Veuillez vous connecter pour utiliser l'application
                </p>
              )}
            </div>
          </section>
        </>
      ) : (
        <div>Loading Web3, accounts, and contract...</div>
      )}
    </div>
  );
}

export default App;
