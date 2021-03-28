import { createContext, useState, useEffect } from "react";
import getWeb3 from "lib/getWeb3";
import VotingContract from "contracts/Voting.json";

const initState = {
  web3: {},
  accounts: [],
  contract: {},
  workflow: 0,
  owner: null,
  votersAddress: [],
  proposalList: [],
  voter: {},
  isAuthorised:false
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
  const setContract = (contract) => {
    setState({
      ...state,
      contract: contract,
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

  const createContractInstance = (web3, fromAccount) => {
    let abiContract = VotingContract.abi;
    let byteCodeContract = VotingContract.bytecode;
    // const accounts = await web3.eth.getAccounts();

    return new Promise(resolve => {

      if (localStorage.getItem('deployedContractAddress') && localStorage.getItem('deployedContractAddress') !== "") {
        console.log('exists', localStorage.getItem('deployedContractAddress'), fromAccount);
        resolve(localStorage.getItem('deployedContractAddress'));
        return;
      }
      let payload = {
        data: byteCodeContract,
        // arguments: [200000000000, "COUCOU"]
      }
      let myContract = new web3.eth.Contract(abiContract, null, {
        from: fromAccount, // default from address
        gasPrice: '20000000000' // default gas price in wei, 20 gwei in this case
      });
      let parameter = {
        from: fromAccount, // default from address
        // gas: web3.utils.toHex(800000).toString(),
        gasPrice: web3.utils.toHex(web3.utils.toWei('30', 'gwei')).toString()
      }
      console.log('check before send', payload, parameter);
      myContract.deploy(payload).send(parameter, (err, transactionHash) => {
        console.log('Transaction Hash :', transactionHash);
      }).on('confirmation', () => { }).then((newContractInstance) => {
        console.log('Deployed Contract Address : ', newContractInstance.options.address);
        localStorage.setItem('deployedContractAddress', newContractInstance.options.address);

        resolve(newContractInstance.options.address)
      })
    })
  };
  // const checkIfUserIsAuthorised = () => {
  //   return votersAddress.indexOf(accounts[0]) === -1;
  // }

  const getContextState = async () => {
    console.log('getContextState');
    // return true
    return new Promise(async (resolve)=>{

      const web3 = await getWeb3();
      // this.web3 = web3;
      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();
      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedContract = await createContractInstance(web3, accounts[0]);
      // setContract(deployedContract);
      if (networkId && networkId !== "5777") {
        console.log('Vous devez être connecté sur Ganache !')
      }
      const deployedNetwork = VotingContract.networks[networkId];
      // deployedNetwork.address = '0x36702042e208AfeAa84186C52C23Cb6De23553B9';
      const contract = new web3.eth.Contract(
        VotingContract.abi,
        deployedContract
        );
        
        const loadedState = {
          web3,
          accounts,
          contract,
          workflow: await contract.methods._workflow().call(),
          owner: await contract.methods.owner().call(),
          votersAddress: await contract.methods.getVotersAddress().call(),
          proposalList: await contract.methods.getProposalList().call(),
          voter: await contract.methods._voterlist(accounts[0]).call(),
        }
        loadedState.isAuthorised = loadedState.votersAddress.indexOf(accounts[0]) !== -1;
        console.log('getContextState++loadedState', loadedState);

        return resolve(loadedState);
      })
  }
  useEffect(() => {
    (async () => {
      try {
        // Get network provider and web3 instance.
        const loadedState = await getContextState();
      
    

        setState(loadedState);

        window.ethereum.on("accountsChanged", async (accounts) => {
          console.log('accoutn cha')
          // let newState = Object.assign({ accounts: accounts }, this.state);
          // loadedState.voter = await loadedState.contract.methods._voterlist(accounts[0]).call();
          const loadedState = await getContextState();
          
          console.log("accountsChanged", state, loadedState);
          // setState(loadedState)
          setState(state => ({ ...state, loadedState }))
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
  }, [children, state, getContextState]);

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
