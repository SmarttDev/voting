import Web3Context from "context/Web3Context";
import React, { useContext, useState, useEffect } from "react";

const VotingTallied = () => {
  let status = 'VotingSessionEnded';
  let text = 'Voting Session has Ended. Votes have been tallied !';
  const { contract, accounts, setWorkflow, owner, proposalList } = useContext(
    Web3Context
  );
  const [winnerProposal, setWinnerProposal] = useState(null);

  const getWinner = async () => {

    let winner = await contract.methods.Winner().call()
    const _winnerProposal = {
      description: winner.description,
      voteCount: winner.voteCount,
    }
    setWinnerProposal(_winnerProposal)
    console.log('winner', _winnerProposal);

  }
  
  useEffect(() => {
      getWinner();
   
  }, [])
  return (
    <>
    {text}
    {/* <a onClick={submitWinningProposal}>Voir</a> */}
    <h1> The winner is : {winnerProposal?.description} with {winnerProposal?.voteCount} vote(s)</h1>
    </>
  )
};

export default VotingTallied;
