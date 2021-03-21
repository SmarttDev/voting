import { useState } from "react";
import Modal from "components/Modal";

const RegisteringVoters = ({ contract, accounts }) => {
  const [showModal, setShowModal] = useState(false);
  const submitRegisterVoter = async (e) => {
    e.preventDefault();

    // Stores a given value, 5 by default.
    await contract.methods
      .RegisterVoter(e.target.addressVoter.value)
      .send({ from: accounts[0] }, async (error, tx) => {
        if (tx) {
          e.target.reset();
        }
      });
  };

  getVoters = async() => {
    const { accounts, contract } = this.state;
  
    // récupérer la liste des comptes autorisés
    const whitelist = await contract.methods.getAddresses().call();
    // Mettre à jour le state 
    this.setState({ whitelist: whitelist });
  };

  const modalTitle = "Title voters";
  const modalContent = "Modal content voters";
  const closeModal = async (e) => {

    // console.log('CloseModal');
    setShowModal(false);
  }
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
      {showModal && <Modal content={modalContent} title={modalTitle} callbackClose={closeModal} />}
    </>
  );
};

export default RegisteringVoters;
