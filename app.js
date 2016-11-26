/*eslint-env node*/

const erisDbFactory = require('eris-db');
const erisContracts = require('eris-contracts');
const solc = require('solc');
const accounts = require("./accounts.js").accounts;
const nodes = require("./ips.js").ips;

var erisdb; /* ErisDB Factory */
var erisdbURL; /* ErisDB RPC URL */
var pipe; /* Pipe for creating contracts */
var contractManager;/* Contract Manager for creating contracts*/
var account = accounts[0].address;

var cors = require('cors');
var userLib = require("./app/user.js");
var appLib = require("./app/lib.js");
var fs = require('fs');

var votingRecordSource = fs.readFileSync('./contracts/votingContract.sol', 'utf8');
var voters = "";
var candidates = "";
var candidatesAddress = "";
var candidatesName = "";
var erisInstance= "";

/*Initialize ERISDB*/
erisdb = erisDbFactory.createInstance(nodes[0]);
erisdb.start(function(error){
    if(!error){
        console.log("Ready to go");
    }
});

pipe = new erisContracts.pipes.DevPipe(erisdb, accounts); /* Create a new pipe*/
contractManager = erisContracts.newContractManager(pipe); /*Create a new contract object using the pipe */

/* Compile the Greeter Contract */
var compiledContract = solc.compile(votingRecordSource);
console.log("Compiled Contract:" + compiledContract.contracts.VotingRecord);
var contractFactory = contractManager.newContractFactory(JSON.parse(compiledContract.contracts.VotingRecord.interface)); //parameter is abi
console.log("Contract Factory:" + contractFactory);

/* Send the contract */
    contractFactory.new.apply(contractFactory, 
    [  // Votantes
      ["A99287FE0DAC4E8145C857EA65E9EDE1560A2DB2","EF61778AC2FC56F4CBCC3C82605CCD77D37595F6"], 
      // Votados
      ["A99287FE0DAC4E8145C857EA65E9EDE1560A2DB2"], 
      // Nombres votados
      [appLib.convertToHex("Team 4")], 
      // Nombre votación
      "Votación 1", 
      { from: account, 
        data:compiledContract.contracts.VotingRecord.bytecode}, 
        (err, contractInstance)=> {
          if(err){
            console.log(err)
          }else{
            erisInstance = contractInstance;
            console.log(contractInstance.address);
          }
      }
    ]);


// Load the appropriate modules for the app
var cfenv = require("cfenv");
var express = require("express");
var bodyParser = require('body-parser');

// Defensiveness against errors parsing request bodies...
process.on('uncaughtException', function (err) {
    console.log('#### Caught exception: ' + err);
});
process.on("exit", function(code) {
    console.log("#### Exiting with code: " + code);
});

// Checking Bluemix setup
var appEnv = cfenv.getAppEnv();

// Configure the app web container
var app = express();
app.use(cors());
app.engine('html', require('ejs').renderFile);
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname + '/public'));

// Finishing configuration of the app web container
app.listen(appEnv.port);
console.log("#### Server listening on port " + appEnv.port);

// Home page
app.get('/', function (req, res) 
{
      res.render('index.html', {compiledContract: compiledContract});   
});

app.get('/getCandidates', function (req, res) 
{
      userLib.getCandidates(req,res,erisInstance);   
});

app.get('/vote', function (req, res) 
{
      userLib.vote(req,res);   
});
