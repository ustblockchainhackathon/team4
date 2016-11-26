// User applications. Authentication & contacts
// users.js
// ========
var jwt         = require('jwt-simple');
var appLib = require("./lib.js");
var erisContracts = require('eris-contracts');
// Promises

module.exports = {
   /*
    getUser : function(id) {
      return q.Promise(function(resolve, reject, notify) {
        console.log("Find user : "+id);
        User.findOne({
          _id: id
        }, function(err, usr) {
          resolve(usr);
        })
      })
    },
    */
    getCandidates : function(req,res,contractInstance) {
      //contractInstance.getCandidatesResults();
      
      contractInstance.getNumberOfCandidates(function (err,numberOfCandidates)
      {
        if(err) {
          console.log(err);
        }else {
          console.log("Number of candidates:" + numberOfCandidates);
          var promises = [];
          
          for(var i = 0; i < numberOfCandidates;i++){
              promises.push(i);
          }
          Promise.all(
              promises.map(function(x,i){
              return getCandidateInternal (contractInstance,i);
            })
          ).then(function (result) {
            console.log("Candidatos: " + result);
            return res.json(
            { success: true, 
              voteName: "Votacion 1",
              candidates: result
            });
          }).catch(function (err)
          {
            console.log(err);
          })
        }
      })
    },

    // Info.
    vote: function(req,res,erisdb,contractAddress,compiledContract) {
      var account = req.body.account;
      var candidateAddress = req.body.candidateAddress;
      var pipe = new erisContracts.pipes.DevPipe(erisdb, [account]); /* Create a new pipe*/

      contractManager = erisContracts.newContractManager(pipe); /*Create a new contract object using the pipe */
      var myContractFactory = contractManager.newContractFactory(JSON.parse(compiledContract.contracts.VotingRecord.interface));
      myContractFactory.at(contractAddress,function(error, contract){
        if(error){
          console.log(error);
        }else{
          contract.voting(
            account.address,candidateAddress,
          { from: account.address },
            function (err, txHash){
              if(err){
                console.log(err)
              }else{
                return res.json(
                  { success: true, 
                    txHash: txHash
                  });
              }
            }
          )
        }
      })
    },
  }


// Functions 
function getCandidateInternal (contactInstance,index)
{
  return new Promise(function(resolve,reject){
    contactInstance.getCandidateResults(index,function (err,candidate)
    {
      {
        if(err) {
          console.log(err);
          return reject (err);
        }else {
          var partsOfStr = candidate.toString();
          partsOfStr = partsOfStr.split(',');
          
          var json = {
              candidate: {
                name: appLib.convertFromHex(partsOfStr[0]), 
                address:partsOfStr[1], 
                votes: partsOfStr[2]}
            }
          return resolve(json);
        }
      }
    })  
  })
}