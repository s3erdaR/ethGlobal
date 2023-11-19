// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

struct Proposal{
    mapping(uint => uint) votes;//movie id to vote count
    mapping(address => bool) hasVoted;
    uint proposal_ending_time;
}

enum Status{
    
    Voting,
    Finalized
}

contract DATV{

    uint VOTE_INTERVAL = 100;//seconds

    mapping(uint=>Proposal) private Proposals;
    uint proposal_count = 0;

    Status status = Status.Finalized;
    uint current_movie;

    address admin;

    constructor(){
        admin = msg.sender;
    }

    function createProposal() public onlyAdmin
    {
        //require(Proposals[proposal_count].executed = true,"Cannot create proposal now!");//to create a new proposal last one should be executed.
        require(status==Status.Finalized,"Proposal is not Finalized");
        proposal_count++;
        Proposal storage _proposal = Proposals[proposal_count];
       _proposal.proposal_ending_time = block.timestamp + VOTE_INTERVAL;
        status = Status.Voting;

    }

    function UpVoteMovie(uint _movie_id) public notVoted {
        require(block.timestamp < Proposals[proposal_count].proposal_ending_time,"Voting is over.");
        Proposals[proposal_count].votes[_movie_id]++;
        Proposals[proposal_count].hasVoted[msg.sender] = true;
    }

    function finalizeProposal() public onlyAdmin  {
        require(status == Status.Voting);
        require(block.timestamp > Proposals[proposal_count].proposal_ending_time,"Voting is not over.");
        current_movie = getChosenMovie();
        status = Status.Finalized;
       
    }
    

    function getChosenMovie() view public returns (uint) 
    {
        //frontend kısmında bir for loop ile bu fonk çağırılır ve en fazla çıkan film ile finalize yapılır.
        uint max_index = 0;
        uint max_val = 0;

        for(uint i = 0;i<100;i++)
        {
            if(Proposals[proposal_count].votes[i] > max_val)
            {
                max_val = Proposals[proposal_count].votes[i];
                max_index = i;
            }
        }

        return max_index;
    }

    function IsVotingOverFunc() view public returns (bool)
    {
        return (block.timestamp >= Proposals[proposal_count].proposal_ending_time);
    }

    function getVotingInterval() view public returns (uint)
    {
        return VOTE_INTERVAL;
    }

    function getCurrentMovie() view public returns (uint)
    {
        return current_movie;
    }

    modifier notVoted() {//Not voted yet
        require(Proposals[proposal_count].hasVoted[msg.sender] == false,"You Already already voted the proposal.");
        _;
    }

    modifier IsMovieIDValid(uint32 _movie_id){
        require(_movie_id <= 100,"Movie ID should be valid.");
        _;
    }

     modifier IsNotVotingOver(){
        require(block.timestamp <= Proposals[proposal_count].proposal_ending_time,"Voting is over.");
        _;
    }

    modifier onlyAdmin()
    {
        require(msg.sender == admin,"You are not admin.");
        _;
    }


}