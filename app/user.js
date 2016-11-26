// User applications. Authentication & contacts
// users.js
// ========
var jwt         = require('jwt-simple');
// Promises
var q = require('q')

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
    getCandidates : function(req,res) {
      return res.json({success: true, candidates: [{candidate: 'Candidato1'}, {candidate:'Candidato2'}]});
    },
    // Info.
    vote: function(req,res) {
      return res.json({success: true, vote: 'Candidato1'});
    },
    getResults : function(req,res) {
      return res.json({success: true, candidates: [{candidate: 'Candidato1',votes:1}, {candidate:'Candidato2',votes:1}]});
    },
  }

