import { createContext, useState, useEffect } from "react";
import getWeb3 from "lib/getWeb3";
import SimpleStorageContract from "contracts/Voting.json";

const Web3Context = createContext(null);

const Web3Provider = ({ children }) => {
  const [web3, setWeb3] = useState({ eth: {} });
  const [accounts, setAccounts] = useState([]);
  const [contract, setContracts] = useState({ methods: {} });
  const [workflow, setWorkflow] = useState(0);
  const [owner, setOwner] = useState(0);

  useEffect(() => {
    (async () => {
      try {
        // Get network provider and web3 instance.
        const web3 = await getWeb3();

        // Use web3 to get the user's accounts.
        const accounts = await web3.eth.getAccounts();

        // Get the contract instance.
        const networkId = await web3.eth.net.getId();
        const deployedNetwork = SimpleStorageContract.networks[networkId];
        const contract = new web3.eth.Contract(
          SimpleStorageContract.abi,
          deployedNetwork && deployedNetwork.address
        );

        // Set web3, accounts, and contract to the state, and then proceed with an
        // example of interacting with the contract's methods.
        setWeb3(web3);
        setAccounts(accounts);
        setContracts(contract);
        setWorkflow(await contract.methods._workflow().call());
        setOwner(await contract.methods.owner().call());
      } catch (error) {
        // Catch any errors for any of the above operations.
        alert(
          `Failed to load web3, accounts, or contract. Check console for details.`
        );
        console.error(error);
      }
    })();
  }, []);

  return (
    <Web3Context.Provider
      value={{
        web3,
        accounts,
        contract,
        workflow,
        owner,
      }}
    >
      {children}
    </Web3Context.Provider>
  );
};

export default Web3Context;
export { Web3Provider };
