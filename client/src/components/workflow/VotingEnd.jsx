import Web3Context from "context/Web3Context";
import React, { useContext, useState, useEffect } from "react";
// interface IWinnerProposal{
//   description:string;
//   voteCount:string;
// }
const VotingEnd = () => {
  let status = 'VotingSessionEnded';
  let text = 'Voting Session has Ended';
  const { contract, accounts, setWorkflow, owner, proposalList } = useContext(
    Web3Context
  );
  const [winnerProposal, setWinnerProposal] = useState(null);

  // await contract.methods.Winner().send({ from: accounts[0] })
  const getWinner = async () => {

    let winner = await contract.methods.Winner().call()
    const _winnerProposal = {
      description: winner.description,
      voteCount: winner.voteCount,
    }
    setWinnerProposal(_winnerProposal)
    console.log('winner', _winnerProposal);

  }
  const submitWinningProposal = async (e) => {
    e.preventDefault();
    await contract.methods
      .WinningProposal()
      .send({ from: accounts[0] }, async (error, tx) => {
        if (tx) {
          getWinner()
        }
        if (error) {
          console.log(error);
        }
      });
  };

  useEffect(() => {
   
  }, [])
  return (
    <>
      <button
          type="button"
          onClick={submitWinningProposal
            // await contract.methods.ProposalStart().send({ from: accounts[0] })
          }
          className="px-8 rounded-lg bg-red-600 text-white font-bold p-4 uppercase border-red-600 border-t border-b border-r"
        >
          Désigner le gagnant
        </button>
      {/* <a onClick={submitWinningProposal}>Voir</a> */}
      {winnerProposal ? <h1> The winner is : {winnerProposal?.description} with {winnerProposal?.voteCount} vote(s)</h1>: ''}
    </>
  )
};

export default VotingEnd;
