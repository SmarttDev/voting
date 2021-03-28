const { expectRevert, expectEvent } = require("@openzeppelin/test-helpers");
const { web3 } = require("@openzeppelin/test-helpers/src/setup");
const { expect } = require("chai");
const Voting = artifacts.require("Voting");
contract("Voting", function (accounts) {
  const owner = accounts[0];
  const voter1 = accounts[1];
  const voter2 = accounts[2];
  // Avant chaque test unitaire
  beforeEach(async function () {
    this.VotingInstance = await Voting.new();
    let accounts = await web3.eth.getAccounts();
    // console.log(accounts);
  });

  // Test Function RegisterVoter

  // test unitaire 1
  it("revert RegisterVoter when not owner", async function () {
    await expectRevert(
      this.VotingInstance.RegisterVoter(voter2, { from: voter1 }),
      "Ownable: caller is not the owner"
    );
  });

  // test unitaire 2
  it("revert when address is 0 ", async function () {
    let _address = "0x0000000000000000000000000000000000000000";
    await expectRevert(
      this.VotingInstance.RegisterVoter(_address, { from: owner }),
      "address is  0! Please check address input"
    );
  });

  // test unitaire 3
  it("revert when voter is already registred", async function () {
    await this.VotingInstance.RegisterVoter(voter1, { from: owner });
    await expectRevert(
      this.VotingInstance.RegisterVoter(voter1, { from: owner }),
      "This address is already registered"
    );
  });

  // test unitaire 4
  it("Register voter", async function () {
    await this.VotingInstance.RegisterVoter(voter1, { from: owner });
    let Voter = await this.VotingInstance._voterlist(voter1);
    expect(Voter.isRegistered).to.equal(true);
  });

  // test unitaire 5
  it("Voter Registered Event ", async function () {
    let receipt = await this.VotingInstance.RegisterVoter(voter1, {
      from: owner,
    });
    expectEvent(receipt, "VoterRegistered");
  });

  // Test Function ProposalStart
  // test unitaire 1
  it("revert ProposalStart when not owner ", async function () {
    await expectRevert(
      this.VotingInstance.ProposalStart({ from: voter1 }),
      "Ownable: caller is not the owner"
    );
  });
  // test unitaire 2
  it("Proposal Start ", async function () {
    // Before transaction
    const statusBefore = await this.VotingInstance.getStatus.call();
    expect(statusBefore.toNumber()).to.equal(0);
    //Transaction
    let receipt = await this.VotingInstance.ProposalStart({ from: owner });
    //After transaction
    const statusAfter = await this.VotingInstance.getStatus.call();
    expect(statusAfter.toNumber()).to.equal(1);
    expectEvent(receipt, "WorkflowStatusChange");
    expectEvent(receipt, "ProposalsRegistrationStarted");
  });

  // Test Function RegisterProposal

  // test unitaire 1
  it("revert  RegisterProposal when status is not correct", async function () {
    let _proposal = "prop1";
    await expectRevert(
      this.VotingInstance.RegisterProposal(_proposal),
      "The status is not correct : Must be ProposalsRegistrationStarted"
    );
  });

  // test unitaire 2
  it("Proposal Registered", async function () {
    //Before Tx
    let proposallist_Before = await this.VotingInstance.getProposalList();
    expect(proposallist_Before.length).to.equal(0);
    //Tx
    let _proposal = "prop1";
    await this.VotingInstance.ProposalStart({ from: owner });
    let receipt = await this.VotingInstance.RegisterProposal(_proposal);
    //After Tx
    let proposallist_After = await this.VotingInstance.getProposalList();
    expect(proposallist_After.length).to.equal(1);
    expect(proposallist_After[0].description).to.eql("prop1");
    let voteCountnull = 0;
    expect(proposallist_After[0].voteCount.toString()).to.eql(
      voteCountnull.toString()
    );
    expectEvent(receipt, "ProposalRegistered");
  });

  // Test Function ProposalEnd
  // test unitaire 1
  it("revert ProposalEnd when not owner ", async function () {
    await expectRevert(
      this.VotingInstance.ProposalEnd({ from: voter1 }),
      "Ownable: caller is not the owner"
    );
  });
  // test unitaire2
  it("ProposalEnd  ", async function () {
    //Before Tx
    await this.VotingInstance.ProposalStart({ from: owner });
    const statusBefore = await this.VotingInstance.getStatus.call();
    expect(statusBefore.toNumber()).to.equal(1);
    //Tx
    let receipt = await this.VotingInstance.ProposalEnd({ from: owner });
    //After Tx
    const statusAfter = await this.VotingInstance.getStatus.call();
    expect(statusAfter.toNumber()).to.equal(2);
    expectEvent(receipt, "WorkflowStatusChange");
    expectEvent(receipt, "ProposalsRegistrationEnded");
  });

  // Test Function VoteStart
  // test unitaire 1
  it("revert VoteStart when not owner ", async function () {
    await expectRevert(
      this.VotingInstance.VoteStart({ from: voter1 }),
      "Ownable: caller is not the owner"
    );
  });

  // test unitaire2
  it("revert VoteStart  ", async function () {
    //Before Tx
    await this.VotingInstance.ProposalStart({ from: owner });
    await this.VotingInstance.ProposalEnd({ from: owner });
    const statusBefore = await this.VotingInstance.getStatus.call();
    expect(statusBefore.toNumber()).to.equal(2);
    //Tx
    let receipt = await this.VotingInstance.VoteStart({ from: owner });
    //After Tx
    const statusAfter = await this.VotingInstance.getStatus.call();
    expect(statusAfter.toNumber()).to.equal(3);
    expectEvent(receipt, "WorkflowStatusChange");
    expectEvent(receipt, "VotingSessionStarted");
  });

  // Test Function AddVote

  // test unitaire 1
  it("revert  AddVote: Vote must be started", async function () {
    let _proposal = "prop";
    await this.VotingInstance.RegisterVoter(voter1, { from: owner });
    await this.VotingInstance.ProposalStart({ from: owner });
    await this.VotingInstance.RegisterProposal(_proposal, { from: voter1 });
    await this.VotingInstance.ProposalEnd({ from: owner });
    await expectRevert(
      this.VotingInstance.AddVote(0, { from: voter1 }),
      "The status is not correct : Must be VotingSessionStarted"
    );
  });

  // test unitaire 2
  it("revert  AddVote:  Voter must be registred", async function () {
    let _proposal = "prop";
    await this.VotingInstance.ProposalStart({ from: owner });
    await this.VotingInstance.RegisterProposal(_proposal, { from: voter1 });
    await this.VotingInstance.ProposalEnd({ from: owner });
    await this.VotingInstance.VoteStart({ from: owner });
    await expectRevert(
      this.VotingInstance.AddVote(0, { from: voter1 }),
      "The voter is not registered"
    );
  });

  // test unitaire 3
  it("revert  AddVote: Voter has already voted", async function () {
    let _proposal = "prop";
    await this.VotingInstance.RegisterVoter(voter1, { from: owner });
    await this.VotingInstance.ProposalStart({ from: owner });
    await this.VotingInstance.RegisterProposal(_proposal, { from: voter1 });
    await this.VotingInstance.ProposalEnd({ from: owner });
    await this.VotingInstance.VoteStart({ from: owner });
    await this.VotingInstance.AddVote(0, { from: voter1 });
    await expectRevert(
      this.VotingInstance.AddVote(0, { from: voter1 }),
      "The voter has already voted"
    );
  });

  // test unitaire 4
  it("revert  AddVote:  Proposition does not exist", async function () {
    let _proposal = "prop";
    await this.VotingInstance.RegisterVoter(voter1, { from: owner });
    await this.VotingInstance.ProposalStart({ from: owner });
    await this.VotingInstance.RegisterProposal(_proposal, { from: voter1 });
    await this.VotingInstance.ProposalEnd({ from: owner });
    await this.VotingInstance.VoteStart({ from: owner });
    await expectRevert(
      this.VotingInstance.AddVote(1, { from: voter1 }),
      "The proposition does not exist"
    );
  });

  // test unitaire 5
  it("revert  AddVote", async function () {
    let _proposal0 = "prop0";
    let _proposal1 = "prop1";
    await this.VotingInstance.RegisterVoter(voter1, { from: owner });
    await this.VotingInstance.ProposalStart({ from: owner });
    await this.VotingInstance.RegisterProposal(_proposal0, { from: voter2 });
    await this.VotingInstance.RegisterProposal(_proposal1, { from: voter1 });
    await this.VotingInstance.ProposalEnd({ from: owner });
    await this.VotingInstance.VoteStart({ from: owner });
    //Before Tx
    let VoterList_Before = await this.VotingInstance._voterlist(voter1);
    expect(VoterList_Before.hasVoted).to.equal(false);
    console.log(VoterList_Before.votedProposalId.toNumber());
    expect(VoterList_Before.votedProposalId.toNumber()).to.equal(0);
    // Tx
    let receipt = await this.VotingInstance.AddVote(1, { from: voter1 });
    //After Tx
    let VoterList_After = await this.VotingInstance._voterlist(voter1);
    expect(VoterList_After.hasVoted).to.equal(true);
    expect(VoterList_After.votedProposalId.toNumber()).to.equal(1);
    expectEvent(receipt, "Voted");
  });

  // Test Function VoteEnd
  // test unitaire 1
  it("revert VoteEnd when not owner ", async function () {
    await expectRevert(
      this.VotingInstance.VoteEnd({ from: voter1 }),
      "Ownable: caller is not the owner"
    );
  });

  // test unitaire2
  it("revert VoteEnd  ", async function () {
    await this.VotingInstance.ProposalStart({ from: owner });
    await this.VotingInstance.ProposalEnd({ from: owner });
    await this.VotingInstance.VoteStart({ from: owner });
    //Before Tx
    const statusBefore = await this.VotingInstance.getStatus.call();
    expect(statusBefore.toNumber()).to.equal(3);
    //Tx
    let receipt = await this.VotingInstance.VoteEnd({ from: owner });
    // After Tx
    const statusAfter = await this.VotingInstance.getStatus.call();
    expect(statusAfter.toNumber()).to.equal(4);
    expectEvent(receipt, "WorkflowStatusChange");
    expectEvent(receipt, "VotingSessionEnded");
  });

  // Test Function WinningProposal

  // test unitaire 1
  it("revert  WinningProposal: Vote must be Ended", async function () {
    await this.VotingInstance.ProposalStart({ from: owner });
    await this.VotingInstance.ProposalEnd({ from: owner });
    await this.VotingInstance.VoteStart({ from: owner });
    await expectRevert(
      this.VotingInstance.WinningProposal(),
      "The status is not correct : Must be VotingSessionEnded"
    );
  });

  // test unitaire 1
  it("WinningProposal", async function () {
    let _proposal0 = "Prop0";
    let _proposal1 = "Prop1";
    let _proposal2 = "Prop2";
    await this.VotingInstance.RegisterVoter(owner, { from: owner });
    await this.VotingInstance.RegisterVoter(voter1, { from: owner });
    await this.VotingInstance.RegisterVoter(voter2, { from: owner });
    await this.VotingInstance.ProposalStart({ from: owner });
    await this.VotingInstance.RegisterProposal(_proposal1, { from: owner });
    await this.VotingInstance.RegisterProposal(_proposal1, { from: voter1 });
    await this.VotingInstance.RegisterProposal(_proposal2, { from: voter2 });
    await this.VotingInstance.ProposalEnd({ from: owner });
    await this.VotingInstance.VoteStart({ from: owner });
    await this.VotingInstance.AddVote(0, { from: owner });
    await this.VotingInstance.AddVote(1, { from: voter1 });
    await this.VotingInstance.AddVote(1, { from: voter2 });
    await this.VotingInstance.VoteEnd({ from: owner });
    let receipt = await this.VotingInstance.WinningProposal();
    expect(
      (await this.VotingInstance._winningProposalId.call()).toNumber()
    ).to.equal(1);
    expectEvent(receipt, "WorkflowStatusChange");
    expectEvent(receipt, "VotesTallied");
  });
  // Test Function Winner

  // test unitaire 1
  it("revert Winner:  Votes must be Tallied", async function () {
    await this.VotingInstance.ProposalStart({ from: owner });
    await this.VotingInstance.ProposalEnd({ from: owner });
    await this.VotingInstance.VoteStart({ from: owner });
    await expectRevert(this.VotingInstance.Winner(), "Result is not ready!");
  });

  // test unitaire 2
  it("Winner: ", async function () {
    let _proposal0 = "Prop0";
    let _proposal1 = "Prop1";
    let _proposal2 = "Prop2";
    await this.VotingInstance.RegisterVoter(owner, { from: owner });
    await this.VotingInstance.RegisterVoter(voter1, { from: owner });
    await this.VotingInstance.RegisterVoter(voter2, { from: owner });
    await this.VotingInstance.ProposalStart({ from: owner });
    await this.VotingInstance.RegisterProposal(_proposal0, { from: owner });
    await this.VotingInstance.RegisterProposal(_proposal1, { from: voter1 });
    await this.VotingInstance.RegisterProposal(_proposal2, { from: voter2 });
    await this.VotingInstance.ProposalEnd({ from: owner });
    await this.VotingInstance.VoteStart({ from: owner });
    await this.VotingInstance.AddVote(0, { from: owner });
    await this.VotingInstance.AddVote(1, { from: voter1 });
    await this.VotingInstance.AddVote(1, { from: voter2 });
    await this.VotingInstance.VoteEnd({ from: owner });
    await this.VotingInstance.WinningProposal();
    let proposal_winner = await this.VotingInstance.Winner.call();
    expect(proposal_winner.description).to.equal(_proposal1);
  });

  // Test Function GetProposal

  // test unitaire 1
  it("revert getProposalList", async function () {
    let _proposal = "Prop";
    // Before TX
    let proposalList_Before = await this.VotingInstance.getProposalList();
    expect(proposalList_Before.length).to.equal(0);
    // TX
    await this.VotingInstance.RegisterVoter(voter1, { from: owner });
    await this.VotingInstance.ProposalStart({ from: owner });
    await this.VotingInstance.RegisterProposal(_proposal, { from: voter1 });
    // After TX
    let proposalList_After = await this.VotingInstance.getProposalList();
    expect(proposalList_After.length).to.equal(1);
    expect(proposalList_After[0].description).to.equal(_proposal);
  });

  // Test Function getVotersAddress
  // test unitaire 1
  it("getVotersAddress", async function () {
    // 1er appel
    await this.VotingInstance.RegisterVoter(voter1, { from: owner });
    await this.VotingInstance.RegisterVoter(voter2, { from: owner });

    let addresses = await this.VotingInstance.getVotersAddress();
    let tab = [voter1, voter2];

    expect(addresses.toString()).to.equal(tab.toString());
    expect(addresses).to.eql(tab);
    expect(addresses).to.be.an("array").that.includes(voter1);
  });
});
