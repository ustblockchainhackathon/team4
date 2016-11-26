contract VotingRecord {
    /* Public variables of the token */
    string public standard = 'Token 0.1';
    string public electionName;
    address owner;
    uint256 candidatesNumber;

    /* This creates an array with all Voters */
    mapping (address => uint8) public votersPool;
    mapping (address => uint256) public candidatesPool;
    mapping (address => bytes32) public candidatesNames;
    mapping (uint8 => address) public candidateLocator;

    /* voting event constructor */
    event Voted(address voterAddress, address candidateAddress, bytes32 nameCandidate);
    
    /* closing election period */
    event Closure(string dateIni, string dateEnd, string winnerName, address winnerAddress);

    /* Initializes contract with initial supply tokens to the creator of the contract */
    function VotingRecord(
        address [] votersPool_,
        address [] candidatesPool_,
        bytes32 [] candidatesNames_,
        string name_
        ) {
            
        owner = msg.sender; //saving contract deployer
        
        for (uint8 i = 0; i < votersPool_.length; i++) { //setting voting right (1 vote per person)
            votersPool[votersPool_[i]] = 1;
        }
        
        for (uint8 j = 0; j < candidatesPool_.length; j++) { //setting candidates count (0 votes)
            candidatesPool[candidatesPool_[j]] = 0;
            candidateLocator[j] = candidatesPool_[j];
            candidatesNumber = candidatesPool_.length;
        }
        
        for (uint8 z = 0; z < candidatesNames_.length; z++) { //creating array of valid candidates for validation
            candidatesNames[candidatesPool_[z]] = candidatesNames_[z];
        }
        
        electionName = name_; //storing name of election
            
        }

    /* Vote for candidate */
    function voting(address _from, address _to) {
        if(votersPool[_from] != msg.sender) throw; //valid voter
        if(votersPool[_from] != 1) throw; //voter can vote
        if(candidatesNames[_to] != "") throw; //voting for valid candidate
        votersPool[msg.sender] -= 1;
        votersPool[_to] += 1; 
        Voted(msg.sender, _to, candidatesNames[_to]);
    }
    
    /* To retrieve data from results */
    function getNumberOfCandidates () constant returns (uint256 candidateNumber_) {
        return candidatesNumber;
        
    }
    
    function getCandidateResults (uint8 candidateLocator_) constant returns (bytes32 candidateName, address candidateAddress, uint256 candidateVotes){
        address candidateAddress_ = candidateLocator[candidateLocator_];
        bytes32 candidateName_ = candidatesNames[candidateAddress_];
        uint256 candidateVotes_ = candidatesPool[candidateAddress_];
        return (candidateName_, candidateAddress_, candidateVotes_);
    }


    /* This unnamed function is called whenever someone tries to send ether to it */
    function () {
        throw;     // Prevents accidental sending of ether
        
        

    }
}
