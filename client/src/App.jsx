import React, { useContext } from "react";
import Web3Context from "context/Web3Context";
import {
  RegisteringVoters,
  Forbidden,
  ProposalStart,
  ProposalEnd,
  VotingStart,
  VotingEnd,
} from "components/workflow";
import WorkflowStatus from "workflowStatus";

function App() {
  const { web3, accounts, workflow, owner, votersAddress } = useContext(
    Web3Context
  );

  const componentWorkflow = (param) => {
    switch (param) {
      case "RegisteringVoters":
        return owner === accounts[0] ? (
          <RegisteringVoters />
        ) : (
          <Forbidden
            content="Connectez-vous avec l'adresse du popriétaire du contrat pour démarrer la
        période de proposition"
          />
        );
      case "ProposalsRegistrationStarted":
        return votersAddress.indexOf(accounts[0]) !== -1 ? (
          <ProposalStart />
        ) : (
          <Forbidden content="Vous n'êtes pas autorisé à enregistrer des propositions. Veuillez utiliser une adresse qui fait partie de la liste des adresses autorisées" />
        );
      case "ProposalsRegistrationEnded":
        return votersAddress.indexOf(accounts[0]) !== -1 ? (
          <ProposalEnd />
        ) : (
          <Forbidden content="Vous n'êtes pas autorisé à voter. Veuillez utiliser une adresse qui fait partie de la liste des adresses autorisées" />
        );
      case "VotingSessionStarted":
        return <VotingStart />;
      case "VotingSessionEnded":
        return <VotingEnd />;
      case "VotesTallied":
        return <></>;
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
