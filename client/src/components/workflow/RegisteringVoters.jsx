import { useState, useEffect, useContext } from "react";
import Web3Context from "context/Web3Context";
import Modal from "components/Modal";
import VotersAddress from "components/VotersAddress";

const RegisteringVoters = () => {
  const { contract, accounts, setWorkflow } = useContext(Web3Context);
  const [showModal, setShowModal] = useState(false);
  const [votersAddress, setVotersAddress] = useState([]);

  contract.events
    .VoterRegistered()
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
        setVotersAddress(await contract.methods.getVotersAddress().call());
      } catch (error) {
        // Catch any errors for any of the above operations.
        alert(
          `Failed to load web3, accounts, or contract. Check console for details.`
        );
        console.error(error);
      }
    })();
  }, [contract]);

  const submitRegisterVoter = async (e) => {
    e.preventDefault();
    const addressVoter = e.target.addressVoter.value;

    await contract.methods
      .RegisterVoter(addressVoter)
      .send({ from: accounts[0] }, async (error, tx) => {
        if (tx) {
          e.target.reset();
          setVotersAddress([...votersAddress, addressVoter]);
        }
        if (error) {
          console.log(error);
        }
      });
  };

  return (
    <>
      <p className="text-indigo-600 font-bold">
        La période d'inscription des votants est ouverte
      </p>
      <form className="mt-6" onSubmit={submitRegisterVoter}>
        <input
          id="addressVoter"
          type="text"
          className="w-9/12 rounded-l-lg p-4 border-t mr-0 border-b border-l text-gray-800 border-gray-200 bg-white"
          placeholder="Ajouter l'adresse d'un votant"
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
        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="px-8 rounded-lg bg-green-600 text-white font-bold p-4 uppercase border-green-600 border-t border-b border-r"
          style={{ transition: "all .15s ease" }}
        >
          Voir les votants
        </button>

        <button
          type="button"
          onClick={async () =>
            await contract.methods.ProposalStart().send({ from: accounts[0] })
          }
          className="px-8 rounded-lg bg-red-600 text-white font-bold p-4 uppercase border-red-600 border-t border-b border-r"
        >
          Démarrer les propositions
        </button>
      </div>
      {showModal && (
        <Modal
          content={<VotersAddress content={votersAddress} />}
          title="Liste des votants"
          setShowModal={setShowModal}
        />
      )}
    </>
  );
};

export default RegisteringVoters;
