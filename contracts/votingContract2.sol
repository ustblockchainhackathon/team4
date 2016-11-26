contract VotingRecord {
    
    /* Public variables */
    string public electionName;
    address owner;
    uint256 candidatesNumber;
    uint256 totalVoteCount;
    uint256 totalVoters;
    uint8 electionActive;

    /* This creates an array with all Voters */
    mapping (address => uint8) public votersPool;
    mapping (address => uint256) public candidatesPool;
    mapping (address => bytes32) public candidatesNames;
    mapping (uint8 => address) public candidateLocator;

    /* voting event constructor */
    event Voted(address voterAddress, address candidateAddress, bytes32 nameCandidate);
    
    /* Initializes contract with initial supply tokens to the creator of the contract */
    function VotingRecord(
        address [] votersPool_,
        address [] candidatesPool_,
        bytes32 [] candidatesNames_,
        string name_
        ) {
            
        owner = msg.sender; //saving contract deployer
        totalVoteCount = 0; //starting vote controller for audits (total = sum of each candidate)
        
        for (uint8 i = 0; i < votersPool_.length; i++) { //setting voting right (1 vote per person)
            votersPool[votersPool_[i]] = 1;
        }
        
        totalVoters = votersPool_.length; 
        
        for (uint8 j = 0; j < candidatesPool_.length; j++) { //setting candidates count (0 votes)
            candidatesPool[candidatesPool_[j]] = 0;
            candidateLocator[j] = candidatesPool_[j];
        }
        
        candidatesNumber = candidatesPool_.length;
        
        for (uint8 z = 0; z < candidatesNames_.length; z++) { //creating array of valid candidates for validation
            candidatesNames[candidatesPool_[z]] = candidatesNames_[z];
        }
        
        electionName = name_; //storing name of election
        
        electionActive = 1; //election is active
            
        }

    /* Vote for candidate */
    function voting(address _from, address _to) {
        if(votersPool[_from] != msg.sender) throw; //valid voter
        if(votersPool[_from] != 1) throw; //voter can vote
        if(candidatesNames[_to] != "") throw; //voting for valid candidate
        if(electionActive != 1) throw; //if election close stop
        votersPool[msg.sender] -= 1; //control for voting uniquiness
        votersPool[_to] += 1; //adding vote to candidate
        totalVoteCount += 1; //tracking votes for auditing
        Voted(msg.sender, _to, candidatesNames[_to]);
    }
    
    /* To retrieve data from results */
    function getNumberOfCandidates () constant returns (uint256 candidateNumber_) {
        return candidatesNumber;
        
    }
    
    function electionStop (address _from) {
        if (owner != msg.sender) throw; //only creator can close election
        electionActive == 0;
    }
    
    function getCandidateResults (uint8 candidateLocator_) constant returns (bytes32 candidateName, address candidateAddress, uint256 candidateVotes){
        address candidateAddress_ = candidateLocator[candidateLocator_]; //get candidate address
        bytes32 candidateName_ = candidatesNames[candidateAddress_]; //get candidate name
        uint256 candidateVotes_ = candidatesPool[candidateAddress_]; //get candidate votes
        return (candidateName_, candidateAddress_, candidateVotes_);
    }
    
    /* Check Sum Validation */
    function votingAudit () constant returns (bool votingSumCheck){
        uint256 totalVotesCandidates;
        uint256 totalVotesVoters;
        uint256 totalNonVoters;
        bool sumCheck;
        
        totalVotesCandidates = 0;
        totalVotesVoters = 0;
        totalNonVoters = 0;
        sumCheck = true; //assumming OK check sum

        for (uint8 s = 0; s < candidatesNumber; s++) { //calculating total votes (from candidates)
            totalVotesCandidates += candidatesPool[s];
        }
        
        for (uint8 m = 0; m < totalVoters; m++){ //calculating total voters and non-voters (from voters)
            if (votersPool[m] == 0) totalVotesVoters += 1;
            if (votersPool[m] == 1) totalNonVoters += 1;
        }
        
        if (totalVotesCandidates != totalVotesVoters) { //auditting sum of votes of each candidate equal total voters
            sumCheck = false;
        }
        
        if (totalVoters != (totalVotesCandidates + totalNonVoters)) { //auditing total votes for candidates plus non voters equals total voters pool
            sumCheck = false;
        }
        
        return (sumCheck);
    }
    


    /* This unnamed function is called whenever someone tries to send ether to it */
    function () {
        throw;     // Prevents accidental sending of ether
        
        

    }
}
