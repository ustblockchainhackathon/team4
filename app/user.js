// User applications. Authentication & contacts
// users.js
// ========
var jwt         = require('jwt-simple');
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
          }).catch(function (err)
          {
            console.log(err);
          })
        }
      })

      return res.json(
        { success: true, 
          voteName: "Votacion 1",
          candidates: [
            {candidate: {
              name: 'Candidato1', 
              address:'ADDRESS1', 
              votes: 30}
            }, 
            {candidate: {
              name: 'Candidato2', 
              address:'ADDRESS2', 
              votes: 10}
            }
          ]
        });
    },
    // Info.
    vote: function(req,res) {
      return res.json({success: true, vote: 'Candidato1'});
    },
    getResults : function(req,res) {
      return res.json({success: true, candidates: [{candidate: 'Candidato1',votes:1}, {candidate:'Candidato2',votes:1}]});
    },
  }

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
          return resolve(candidate);
        }
      }
    })  
  })
}