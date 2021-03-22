import { createContext, useState, useEffect } from "react";
import getWeb3 from "lib/getWeb3";
import SimpleStorageContract from "contracts/Voting.json";

const initState = {
  web3: {},
  accounts: [],
  contract: {},
  workflow: 0,
  owner: null,
  votersAddress: [],
  proposalList: [],
  voter: {},
};

const Web3Context = createContext();

const Web3Provider = ({ children }) => {
  const [state, setState] = useState(initState);

  const setProposalList = (proposal) => {
    setState({
      ...state,
      proposalList: [
        ...state.proposalList,
        { description: proposal, voteCount: 0 },
      ],
    });
  };

  const setVotersAddress = (voterAddress) => {
    setState({
      ...state,
      votersAddress: [...state.votersAddress, voterAddress],
    });
  };

  const setWorkflow = (workflow) => {
    setState({
      ...state,
      workflow,
    });
  };

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

        setState({
          web3,
          accounts,
          contract,
          workflow: await contract.methods._workflow().call(),
          owner: await contract.methods.owner().call(),
          votersAddress: await contract.methods.getVotersAddress().call(),
          proposalList: await contract.methods.getProposalList().call(),
          voter: await contract.methods._voterlist(accounts[0]).call(),
        });

        window.ethereum.on("accountsChanged", (accounts) => {
          console.log("accountsChanged");
        });

        window.ethereum.on("networkChanged", (networkId) => {
          // Time to reload your interface with the new networkId
          console.log("networkChange");
        });
      } catch (error) {
        // Catch any errors for any of the above operations.
        alert(
          `Failed to load web3, accounts, or contract. Check console for details.`
        );
        console.error(error);
      }
    })();
  }, [children, state]);

  return (
    <Web3Context.Provider
      value={{ ...state, setProposalList, setVotersAddress, setWorkflow }}
    >
      {children}
    </Web3Context.Provider>
  );
};

export default Web3Context;
export { Web3Provider };
